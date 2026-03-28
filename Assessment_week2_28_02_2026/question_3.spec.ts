import {test} from "@playwright/test";
test("question_3",async({page})=>{
    await page.goto("https://demoapps.qspiders.com/ui?scenario=1");
    await page.locator("//input[@name='name']").fill("Shashwat");
    await page.locator("//input[@name='email']").fill("shashwat@gmail.com");
    await page.locator("//input[@name='password']").fill("Shashwat@123");
    await page.locator("//button[@type='submit']").click();
    await page.locator("//input[@id='email']").fill("shashwat@gmail.com");
    await page.locator("//input[@id='password']").fill("Shashwat@123");
    await page.locator("//button[@type='submit']").click();
    await page.screenshot({path:"screenshot/question_3_"+Date.now()+".png"});


})