import {Page,Locator} from '@playwright/test'
import fs from "fs" 
import path from "path"
const jsonData=fs.readFileSync(path.join(__dirname,"../Utility/login.json"),'utf-8')
const data=JSON.parse(jsonData)
class Login{
    loginUrl:Locator;
    page:Page;
    email:Locator;
    password:Locator;
    loginBtn:Locator;
    constructor(page:Page){
        this.page=page;
        this.loginUrl=page.locator('//a[@href="/login"]')
        this.email=page.locator('#Email')
        this.password=page.locator('#Password')
        this.loginBtn=page.locator('//input[@class="button-1 login-button"]')
    }
    async Login(){
        await this.loginUrl.click()
        await this.email.fill(data.Email)
        await this.password.fill(data.Password)
        await this.page.screenshot({path:"./ScreenShot/Login.png"})
        await this.loginBtn.click()
    }
}
export default Login