import { test, expect } from '@playwright/test';
import Login from "../PageObjectModel/login.page.ts"
import fs from "fs"
import path from "path"
const JsonUrl=fs.readFileSync(path.join(__dirname,"../Utility/url.json"),'utf-8')
const url=JSON.parse(JsonUrl)
test('DemoWebShop', async ({ page }) => {
    await page.goto(url.url)
    const LoginPage=new Login(page)
    await LoginPage.Login()
})