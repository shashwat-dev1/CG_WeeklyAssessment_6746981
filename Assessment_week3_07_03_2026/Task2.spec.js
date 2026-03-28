import { test, expect } from "@playwright/test"
import fs from "fs"
import path from "path"
let data = JSON.parse(
  fs.readFileSync(path.join(__dirname,"./testdata/students.json"))
)
test("Student registration using JSON data", async ({ page }) => {
    await page.goto("https://demoqa.com/automation-practice-form")
    await page.evaluate(() => {
        const ads = document.querySelectorAll("iframe")
        ads.forEach(ad => ad.remove())
    })
    for(let d of data){
        await page.fill("#firstName", d.firstName)
        await page.fill("#lastName", d.lastName)
        await page.fill("#userEmail", d.email)
        await page.locator(`label[for="gender-radio-1"]`).click()
        await page.fill("#userNumber", d.mobile)
        await page.locator("#submit").scrollIntoViewIfNeeded()
        await page.click("#submit")
        const modal = page.locator(".modal-content")

        await expect(modal).toBeVisible()

        await expect(page.locator("td").filter({ hasText: d.firstName }).first()).toBeVisible()
        await expect(page.locator("td").filter({ hasText: d.email }).first()).toBeVisible()
        await expect(page.locator("td").filter({ hasText: d.mobile }).first()).toBeVisible()
        console.log("Validated student:", d.firstName)
        await page.click("#closeLargeModal")
        await page.reload()
        await page.evaluate(() => {
            const ads = document.querySelectorAll("iframe")
            ads.forEach(ad => ad.remove())
        })
    }
})