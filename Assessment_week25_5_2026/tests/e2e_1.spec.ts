import { test, expect } from "@playwright/test";
import data from "../utils/data.json";
import { HomePage } from "../POM/HomePage.page";
import { LoginPage } from "../POM/LoginPage.page";
import { PropertyListingPage } from "../POM/PropertyListingPage.page";
import { FlatDetails } from "../POM/FlatDetails.page";

test.describe("E2E Scenario 1", () => {
  
  test.fixme("E2E with Login: Search, Filter and View Property @e2e-login", async ({ page }) => {
    await page.goto(data.URL);
    const home = new HomePage(page);
    const [loginPopup] = await home.LoginAction();
    const loginPage = new LoginPage(loginPopup);
    await loginPage.LoginAction();
    await page.waitForTimeout(3000);
    await home.selectBuyReadyToMove()
    await home.searchLocation(data.searchCriteria.location);

    const listingPage = new PropertyListingPage(page);
    await listingPage.selectBHKFilter(data.filters.bhk);
    const propertyCount = await listingPage.getPropertyCount();
    expect(propertyCount).toBeGreaterThan(0);
    console.log(`Found ${propertyCount} properties`);
    const firstProperty = await listingPage.getFirstPropertyDetails();
    console.log("First Property:", firstProperty);
    const [detailPage] = await home.openPropertyDetails();
    const flatDetails = new FlatDetails(detailPage);
    const propertyDetails = await flatDetails.getPropertyDetails();
    expect(propertyDetails.title).not.toBeNull();
  });
});
