import {Page,Locator} from "@playwright/test"
import fs from "fs"
import path from "path"
const CompareJson=fs.readFileSync(path.join(__dirname,"../Utility/compare.json"),"utf-8")
const data=JSON.parse(CompareJson)
class Compare{
    page:Page;
    homeurl:Locator;
    computer:Locator;
    desktop:Locator;
    filter1:Locator;
    filter2:Locator;
    product1:Locator;
    product2:Locator;
    processor:Locator;
    RAM:Locator;
    HDD:Locator;
    Software:Locator;
    compareBtn:Locator
    constructor(page:Page){
        this.page=page;
        this.homeurl=page.locator('(//a[@href="/"])[1]')
        this.computer=page.locator('//a[@href="/computers"]').first()
        this.desktop=page.locator('//a[@href="/desktops"]').nth(3)
        this.filter1=page.locator('//a[@href="https://demowebshop.tricentis.com/desktops?price=-1000"]')
        this.filter2=page.locator('//a[@href="https://demowebshop.tricentis.com/desktops?price=1000-1200"]')
        this.product1=page.locator('//a[@href="/build-your-cheap-own-computer"]').last()
        this.processor=page.getByLabel(data.Processor)
        this.RAM=page.getByLabel(data.RAM)
        this.HDD=page.getByLabel(data.HDD)
        this.Software=page.getByLabel(data.Software)
        this.compareBtn=page.locator('//input[@value="Add to compare list"]')
        this.product2=page.locator('//a[@href="/build-your-own-computer"]').first()
    }
    async addProduct1(){
        await this.homeurl.click()
        await this.computer.click()
        await this.desktop.click()
        await this.filter1.click()
        await this.product1.click()
        await this.processor.click()
        await this.RAM.click()
        await this.HDD.click()
        await this.Software.click()
        await this.compareBtn.click()
    }

    async addProduct2(){
        await this.homeurl.click()
        await this.computer.click()
        await this.desktop.click()
        await this.filter2.click()
        await this.product2.click()
        await this.HDD.click()
        await this.compareBtn.click()
    }
}
export default Compare