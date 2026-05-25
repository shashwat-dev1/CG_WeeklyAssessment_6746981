import { test, expect } from "@playwright/test";
import data from "../utils/data.json";
import { HomePage } from "../POM/HomePage.page";
import { PropertyListingPage } from "../POM/PropertyListingPage.page";

test.describe("End-to-end scenario 3", () => {

  test("Basic search for location", async ({ page }) => {
    await page.goto(data.URL);
    const home = new HomePage(page);
    await home.selectBuyReadyToMove();
    await home.searchLocation(data.searchCriteria.location);
    const propertyCount = await home.getPropertyCount();
    expect(propertyCount).toBeGreaterThan(0);
    
    console.log(`Found ${propertyCount} properties`);
  });
  
  test("Apply BHK filter", async ({ page }) => {
    await page.goto(data.URL);
    const home = new HomePage(page);
    await home.selectBuyReadyToMove();
    await home.searchLocation(data.searchCriteria.location);
    const listingPage = new PropertyListingPage(page);
    await listingPage.selectBHKFilter(data.filters.bhk);
    
    const propertyCount = await listingPage.getPropertyCount();
    expect(propertyCount).toBeGreaterThan(0);
    const hasCorrectBHK = await listingPage.verifyCardsContainBHK(data.filters.bhk);
    expect(hasCorrectBHK).toBeTruthy();
    
    console.log(`Found property count: ${propertyCount} properties with ${data.filters.bhk}`);
  });

  test("Complete Search, Filter and Property Details Flow", async ({ page }) => {
    await page.goto(data.URL);
    const home = new HomePage(page);
    await home.selectBuyReadyToMove();
    await home.searchLocation(data.searchCriteria.location);
    const listingPage = new PropertyListingPage(page);
    await listingPage.selectBHKFilter(data.filters.bhk);
    const propertyCount = await listingPage.getPropertyCount();
    expect(propertyCount).toBeGreaterThan(0);
    console.log(`Total properties after filter: ${propertyCount}`);
    const hasCorrectBHK = await listingPage.verifyCardsContainBHK(data.filters.bhk);
    expect(hasCorrectBHK).toBeTruthy();
    const firstProperty = await listingPage.getFirstPropertyDetails();
    console.log("First Property:", firstProperty);
    await page.screenshot({
      path: `test-results/search-filter-results-${Date.now()}.png`,
      fullPage: true
    });
    
    console.log("Complete flow test completed successfully");
  });

  test("Pagination: Load more properties", async ({ page }) => {
    await page.goto(data.URL);
    const home = new HomePage(page);
    await home.selectBuyReadyToMove();
    await home.searchLocation(data.searchCriteria.location);
    const listingPage = new PropertyListingPage(page);
    const initialCount = await listingPage.getPropertyCount();
    console.log(`Initial property count: ${initialCount}`);
    await listingPage.loadMoreProperties();
    const newCount = await listingPage.getPropertyCount();
    console.log(`New property count: ${newCount}`);
  });
});

