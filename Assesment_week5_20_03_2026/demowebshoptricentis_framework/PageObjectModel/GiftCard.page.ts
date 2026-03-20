import {Page,Locator,expect} from "@playwright/test"
import fs from "fs"
import path from "path"
const giftJson=fs.readFileSync(path.join(__dirname,"../Utility/giftcard.json"),"utf-8")
const data=JSON.parse(giftJson)
class GiftCard{
    page:Page;
    homeurl:Locator;
    product:Locator;
    productNameonProductPage:Locator;
    RecipientName:Locator;
    RecipientEmail:Locator;
    SenderName:Locator;
    SenderEmail:Locator;
    Message:Locator;
    AddtoCartBtn:Locator;
    productNameatCart:Locator;
    removeCheckbox:Locator;
    updateCart:Locator;
    tnc:Locator;
    checkout:Locator;
    cartpage:Locator;
    constructor(page:Page){
        this.page=page;
        this.homeurl=page.locator('(//a[@href="/"])[1]')
        this.product=page.locator('//h2/a[@href="/25-virtual-gift-card"]')
        this.RecipientName=page.locator('#giftcard_2_RecipientName')
        this.RecipientEmail=page.locator('#giftcard_2_RecipientEmail')
        this.SenderName=page.locator('#giftcard_2_SenderName')
        this.SenderEmail=page.locator('#giftcard_2_SenderEmail')
        this.Message=page.locator('#giftcard_2_Message')
        this.AddtoCartBtn=page.locator("#add-to-cart-button-2")
        this.cartpage=page.locator("#topcartlink")
        this.productNameonProductPage=page.locator('//h1[@itemprop="name"]')
        this.productNameatCart=page.locator('//a[@class="product-name"]')
        this.removeCheckbox=page.locator('//input[@name="removefromcart"]')
        this.updateCart=page.locator('//input[@name="updatecart"]')
        this.tnc=page.locator('#termsofservice')
        this.checkout=page.locator('#checkout')

    }
    async giftCard(){
        await this.homeurl.click()
        await this.product.click()
        await this.RecipientName.fill(data.RecipientName)
        await this.RecipientEmail.fill(data.RecipientEmail)
        await this.SenderName.fill(data.SenderName)
        await this.SenderEmail.fill(data.SenderEmail)
        await this.Message.fill(data.Message)
        await this.page.screenshot({path:"./ScreenShot/Giftcard.png"})
        await this.AddtoCartBtn.click()
        await this.cartpage.click()
        const nameatcart=await this.productNameatCart.textContent()
        await expect(this.productNameatCart).toHaveText("$25 Virtual Gift Card");
        console.log("Product Added to Cart Successfully!!!");
    }
    async removingfromCart(){
        await this.removeCheckbox.check()
        //Bug Found : Remove Button not working have to update cart using removeCheckbox
        await this.updateCart.click()
        await this.page.screenshot({path:"./ScreenShot/product_removed.png"})
        console.log("Product Removed Successfully !!");
        
    }
    async purchaseGiftCard(){
        await this.tnc.check()
        await this.page.screenshot({path:"./ScreenShot/product_purchased.png"})      
        await this.checkout.click()
    }
}
export default GiftCard