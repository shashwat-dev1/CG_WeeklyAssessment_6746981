import { Page, Locator } from '@playwright/test';

export class FlatDetails {
    page: Page;

    propertyTitle: Locator;
    propertyPrice: Locator;
    propertyLocation: Locator;
    propertyDetails: Locator;
    contactButtons: Locator;

    constructor(page: Page) {
        this.page = page;

        this.propertyTitle = page.locator("//h1[contains(@class, 'title') or contains(@class, 'name')]")
            .or(page.locator("h1").first())
            .first();

        this.propertyPrice = page.locator("//div[contains(@class, 'price')]")
            .or(page.locator("//span[contains(@class, 'price')]"))
            .first();

        this.propertyLocation = page.locator("//div[contains(@class, 'location') or contains(@class, 'loc')]")
            .or(page.locator("//span[contains(@class, 'location') or contains(@class, 'loc')]"))
            .first();

        this.propertyDetails = page.locator("//div[contains(@class, 'details') or contains(@class, 'detail')]");

        this.contactButtons = page.locator("//button[contains(text(), 'Contact Owner') or contains(text(), 'Get Phone No.') or contains(text(), 'Contact')]")
            .or(page.locator("//a[contains(text(), 'Contact Owner') or contains(text(), 'Get Phone No.') or contains(text(), 'Contact')]"));
    }

    async contactOwner(): Promise<boolean> {
        try {
            console.log('Attempting to contact owner...');

            await this.contactButtons.first().waitFor({ state: 'visible', timeout: 10000 });

            await this.contactButtons.first().click({ force: true });

            console.log('Contact owner clicked successfully');
            return true;
        } catch (error) {
            console.error('Error contacting owner:', error);

            await this.page.screenshot({
                path: `test-results/contact-owner-error-${Date.now()}.png`,
                fullPage: true
            });

            return false;
        }
    }

    async getPropertyTitle(): Promise<string | null> {
        try {
            return await this.propertyTitle.textContent();
        } catch {
            return null;
        }
    }

    async getPropertyPrice(): Promise<string | null> {
        try {
            return await this.propertyPrice.textContent();
        } catch {
            return null;
        }
    }

    async getPropertyLocation(): Promise<string | null> {
        try {
            return await this.propertyLocation.textContent();
        } catch {
            return null;
        }
    }

    async getPropertyDetails(): Promise<{
        title: string | null;
        price: string | null;
        location: string | null;
    }> {
        return {
            title: await this.getPropertyTitle(),
            price: await this.getPropertyPrice(),
            location: await this.getPropertyLocation()
        };
    }

    async clickContact(): Promise<void> {
        await this.contactButtons.first().click();
        console.log('Contact button clicked');
    }

    async capturePropertyDetails(): Promise<void> {
        await this.page.screenshot({
            path: `test-results/property-details-${Date.now()}.png`,
            fullPage: true
        });

        console.log('Property details screenshot captured');
    }
}