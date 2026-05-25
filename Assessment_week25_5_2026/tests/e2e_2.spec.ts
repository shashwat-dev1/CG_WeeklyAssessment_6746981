import { test, expect } from "@playwright/test";
import data from "../utils/data.json";
import { HomePage } from "../POM/HomePage.page";
import { PropertyListingPage } from "../POM/PropertyListingPage.page";
import { FlatDetails } from "../POM/FlatDetails.page";

test.describe("E2E Scenario 2", () => {
  test("E2E without Login", async ({ page }) => {
    await page.goto(data.URL);
    const home = new HomePage(page);
    await home.selectBuyReadyToMove();
    await home.searchLocation(data.searchCriteria.location);
    const listingPage = new PropertyListingPage(page);
    await listingPage.selectBHKFilter(data.filters.bhk);
    const propertyCount = await listingPage.getPropertyCount();
    expect(propertyCount).toBeGreaterThan(0);
    console.log(`Found ${propertyCount} properties`);
    const hasCorrectBHK = await listingPage.verifyCardsContainBHK(data.filters.bhk);
    expect(hasCorrectBHK).toBeTruthy();
    const titles = await listingPage.getAllPropertyTitles();
    console.log(`Retrieved ${titles.length} property titles`);
    const firstProperty = await listingPage.getFirstPropertyDetails();
    console.log("First Property Details:", firstProperty);
    expect(firstProperty.title).not.toBeNull();
    const [detailPage] = await home.openPropertyDetails();
    const flatDetails = new FlatDetails(detailPage);
    const propertyDetails = await flatDetails.getPropertyDetails();
    console.log("Detailed Property Info:", propertyDetails);
    await flatDetails.capturePropertyDetails();
    expect(propertyDetails.title).not.toBeNull();
  });
});
