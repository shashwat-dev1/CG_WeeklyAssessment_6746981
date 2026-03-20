import { test, expect } from '@playwright/test';
import CreateAccPage from "../PageObjectModel/create_acc.page.ts"
import Login from "../PageObjectModel/login.page.ts"
import Compare from "../PageObjectModel/compare.page.ts"
import fs from "fs"
import path from "path"
const JsonUrl=fs.readFileSync(path.join(__dirname,"../Utility/url.json"),'utf-8')
const url=JSON.parse(JsonUrl)
test('DemoWebShop', async ({ page }) => {
    await page.goto(url.url)
    const registerPage = new CreateAccPage(page)
    await registerPage.createACC()
    const LoginPage=new Login(page)
    await LoginPage.Login()
    const compare=new Compare(page)
    await compare.addProduct1()
    await compare.addProduct2()
    await page.screenshot({path:"./ScreenShot/Compare.png"})
});
