import {test} from '@playwright/test';
test('Question 1', async ({page}) => {
    await page.goto('https://amazon.com');
    await page.locator('#twotabsearchtextbox').fill('Shoes');
    await page.locator('#nav-search-submit-button').click();
    const title = await page.locator('(//div[@data-component-type="s-search-result"]//h2//span)[1]').textContent();
    console.log(title);
    const price = await page.locator('(//span[@class="a-price-whole"])[1]').first().textContent()
    console.log(price);
    await page.screenshot({path:`screenshot/question_1_${Date.now()}.png`});
});