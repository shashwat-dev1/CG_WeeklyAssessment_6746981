import {test} from "@playwright/test";
test("question_5",async({page})=>{
    await page.goto("https://www.amazon.com/")
    await page.locator("//input[@id='twotabsearchtextbox']").fill("shoes");
    await page.locator('#nav-search-submit-button').click();
    await page.locator("(//i[@class='a-icon a-icon-checkbox'])").nth(2).click();
    const price = await page.locator('(//span[@class="a-price-whole"])').nth(3).textContent();
    console.log(price);
    await page.screenshot({path:"screenshot/question_5_"+Date.now()+".png"});
})