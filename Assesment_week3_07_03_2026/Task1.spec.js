import { test, expect } from "@playwright/test";
import jsondata from './testdata/products.json';


test("Amazon product search validation", async ({ page }) => {
  await page.goto("https://www.amazon.in/");
  let search = await page.locator("input#twotabsearchtextbox");
  const data = Object.values(jsondata);

  for (let item of data) {
    await search.fill(item);
    await page.keyboard.press("Enter");
    let firstItem = await page.locator('//div[@data-component-type="s-search-result"]//img').first();
    let [page2] = await Promise.all([
      page.waitForEvent("popup"),
      firstItem.click(),
    ]);
    let prodTitle = await page2.locator('//span[@id="productTitle"]');
    let prodRating = await page2.locator('//span[@class="a-size-small a-color-base" and @aria-hidden="true"]').first();
    let prodPrice = await page2.locator('//div[@class="a-section a-spacing-none aok-align-center aok-relative apex-core-price-identifier"]//span[@class="a-price-whole"]').first();
      await expect(prodTitle).toBeVisible()
      await expect(prodRating).toBeVisible()
      await expect(prodPrice).toBeVisible()
    console.log(await prodTitle.textContent());
    console.log(await prodRating.textContent());
    console.log(await prodPrice.textContent());
    await page2.close();
  }
});