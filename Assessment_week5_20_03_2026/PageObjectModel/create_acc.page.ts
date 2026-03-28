import {Page,Locator} from '@playwright/test'
import fs from "fs" 
import path from "path"
const jsonData=fs.readFileSync(path.join(__dirname,"../Utility/register.json"),'utf-8')
const data=JSON.parse(jsonData)
class CreateAccPage {
    page:Page;
    registerlink:Locator;
    genderMale:Locator;
    genderFemale:Locator;
    firstName:Locator;
    lastName:Locator;
    email:Locator;
    password:Locator;
    conPassword:Locator;
    registerBtn:Locator;
    constructor(page:Page){
        this.page=page;
        this.registerlink=page.locator('//a[@href="/register"]')
        this.genderMale=page.locator('#gender-male');
        this.genderFemale=page.locator('#gender-female')
        this.firstName=page.locator('#FirstName')
        this.lastName=page.locator('#LastName')
        this.email=page.locator('#Email')
        this.password=page.locator('#Password')
        this.conPassword=page.locator('#ConfirmPassword')
        this.registerBtn=page.locator('#register-button')
}
async createACC(){
    await this.registerlink.click()
    if(data.gender==="Male"){
        await this.genderMale.check()
    }
    else{
        await this.genderFemale.check()
    }
    await this.firstName.fill(data.FirstName)
    await this.lastName.fill(data.LastName)
    await this.email.fill(data.Email)
    await this.password.fill(data.Password)
    await this.conPassword.fill(data.ConPassword)
    await this.page.screenshot({path:"./ScreenShot/Register.png"})
    await this.registerBtn.click()
}
}
export default CreateAccPage