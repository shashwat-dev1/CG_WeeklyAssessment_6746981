import { Page, Locator } from '@playwright/test';
import data from '../utils/data.json';

export class HomePage {
    page: Page;
    buyTab: Locator;
    readyToMoveLink: Locator;
    loginHover: Locator;
    loginSignUp: Locator;
    cityInput: Locator;
    searchButton: Locator;
    propertyCards: Locator;
    getBrochureButtons: Locator;

    constructor(page: Page) {
        this.page = page;

        this.buyTab = page.locator("//a[@id='buyheading']");

        this.readyToMoveLink = page.locator("a[href*='ready-to-move']").first();

        this.loginHover = page.getByText(data.locators.homePage.loginHover, { exact: true });

        this.loginSignUp = page.getByText(data.locators.homePage.loginSignUp);

        this.cityInput = page.getByPlaceholder('Add More');

        this.searchButton = page.getByText('Search', { exact: true });

        this.propertyCards = page.locator('h2:has-text("BHK")')
            .or(page.locator(data.locators.listingPage.propertyCards));

        this.getBrochureButtons = page.getByText('Contact Owner');
    }

    async navigateToHome(): Promise<void> {
        await this.page.goto(data.URL);
        await this.page.waitForLoadState('domcontentloaded');

        console.log('Navigated to homepage');
    }

    async selectBuyReadyToMove(): Promise<void> {
        await this.buyTab.hover();

        await this.page.waitForTimeout(1000);

        try {
            await this.readyToMoveLink.waitFor({
                state: 'visible',
                timeout: 5000
            });

            await this.readyToMoveLink.evaluate(el =>
                el.removeAttribute('target')
            );

            await this.readyToMoveLink.click();
        } catch {
            console.log('Dropdown not accessible, using direct navigation');

            await this.page.goto(data.readyToMoveURL);
        }

        await this.page.waitForLoadState('networkidle');

        console.log('Selected Buy → Ready to Move');
    }

    async searchLocation(location: string): Promise<void> {
        const currentUrl = this.page.url().toLowerCase();

        const locationLower = location.toLowerCase();

        if (
            currentUrl.includes(locationLower) ||
            currentUrl.includes('pppfs') ||
            currentUrl.includes('flats-in-') ||
            currentUrl.includes('property-in-')
        ) {
            await this.page.waitForLoadState('networkidle');

            console.log(`Already on results page for: ${location}`);

            return;
        }

        const searchUrl = `https://www.magicbricks.com/ready-to-move-flats-in-${locationLower}-pppfs`;

        await this.page.goto(searchUrl);

        await this.page.waitForLoadState('networkidle');

        console.log(`Navigated to results page for: ${location}`);
    }

    async LoginAction(): Promise<[Page]> {
        await this.loginHover.last().hover();

        const [page2] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.loginSignUp.click()
        ]);

        await page2.waitForLoadState('networkidle');

        console.log('Login popup opened');

        return [page2];
    }

    async openPropertyDetails(): Promise<[Page]> {
        await this.propertyCards.first().waitFor({
            state: 'visible',
            timeout: 30000
        });

        const firstCard = this.propertyCards.first();

        const [detailPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            firstCard.click()
        ]);

        await detailPage.waitForLoadState('networkidle');

        console.log('Property card clicked - Detail page opened');

        return [detailPage];
    }

    async getPropertyCount(): Promise<number> {
        return await this.propertyCards.count();
    }

    async clickPropertyCard(index: number = 0): Promise<void> {
        await this.propertyCards.nth(index).click();

        await this.page.waitForLoadState('networkidle');

        console.log(`Clicked property card at index ${index}`);
    }
}