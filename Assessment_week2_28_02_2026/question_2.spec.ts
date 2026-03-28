import {test} from "@playwright/test"

test("task2",async({page})=>{
    await page.goto("https://www.flipkart.com/");
    await page.locator('//div/input').first().fill("Phones");
    await page.keyboard.press("Enter");
    await page.locator("(//div[@class='ybaCDx'])[1]").click();
   const price =await page.locator('(//div[@class="hZ3P6w DeU9vF"])[3]').textContent();
   console.log(price);
   await page.screenshot({path:"screenshot/question_2"+Date.now()+".png"});
});