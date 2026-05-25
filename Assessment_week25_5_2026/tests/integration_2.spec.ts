// Search Navigate and extract details
import { test, expect } from "@playwright/test";
import data from "../utils/data.json";
import { HomePage } from "../POM/HomePage.page";
import { FlatDetails } from "../POM/FlatDetails.page";


test("Integration Test 2", async ({ page }) => {
    await page.goto(data.URL);
    const home = new HomePage(page);
    await home.selectBuyReadyToMove();
    await home.searchLocation(data.searchCriteria.location);
    const propertyCount = await home.getPropertyCount();
    expect(propertyCount).toBeGreaterThan(0);
    console.log(`Found ${propertyCount} properties`);
    const [detailPage] = await home.openPropertyDetails();
    const flatDetails = new FlatDetails(detailPage);
    const propertyDetails = await flatDetails.getPropertyDetails();
    console.log("Property Details:", propertyDetails);
    expect(propertyDetails.title).not.toBeNull();
    const contacted = await flatDetails.contactOwner();
    if (contacted) {
      console.log(`Owner contacted successfully`);
    } else {
      console.log("Could not contact owner");
    }
  });