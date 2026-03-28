import { test, expect } from "@playwright/test"
import fs from "fs"
import path from "path"

let data = JSON.parse(
  fs.readFileSync(path.join(__dirname,"./testdata/users.json"))
)
test("Login → Profile → Logout using JSON data", async ({ page }) => {
    for(let d of data){
        await page.goto("https://demoqa.com/login")
        await page.fill("#userName", d.username)
        await page.fill("#password", d.password)
        await page.click("#login")
        await expect(page).toHaveURL(/profile/)
        const usernameLabel = page.locator("#userName-value")
        await expect(usernameLabel).toBeVisible()
        console.log("Logged in as:", await usernameLabel.textContent())

        const logoutBtn = page.locator("#submit").first()
        await page.mouse.wheel(0,2000)
        await expect(logoutBtn).toBeVisible()
        await logoutBtn.click()
        await expect(page).toHaveURL(/login/)
        await expect(page.locator("#login")).toBeVisible()
        console.log("Logout successful")
    }

})