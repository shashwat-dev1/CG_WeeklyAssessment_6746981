import { Page, Locator } from '@playwright/test';
import data from '../utils/data.json';

export class PropertyListingPage {
    page: Page;
    bhkFilter: Locator;
    propertyCards: Locator;
    propertyCardTitles: Locator;
    propertyCardPrices: Locator;
    propertyCardLocations: Locator;
    filterChips: Locator;
    sortDropdown: Locator;
    paginationNext: Locator;
    loadMore: Locator;

    constructor(page: Page) {
        this.page = page;

        this.bhkFilter = page
            .getByText('BHK', { exact: true })
            .first();

        this.propertyCards = page
            .locator('h2:has-text("BHK")')
            .or(page.locator(data.locators.listingPage.propertyCards));

        this.propertyCardTitles = page.locator('h2:has-text("BHK")');

        this.propertyCardPrices = page.locator('h2:has-text("BHK")');

        this.propertyCardLocations = page.locator('h2:has-text("BHK")');

        this.filterChips = page.locator(
            "//div[contains(@class, 'filter-chip') or contains(@class, 'chipItem')]"
        );

        this.sortDropdown = page.getByText('Sort by:', {
            exact: false
        });

        this.paginationNext = page.getByText('Next').first();

        this.loadMore = page.getByText('Load More').first();
    }

    async selectBHKFilter(bhkType: string): Promise<void> {
        try {
            const doneButton = this.page.getByText('Done', {
                exact: true
            });

            if (await doneButton.isVisible({ timeout: 1000 })) {
                await doneButton.click();

                await this.page.waitForTimeout(500);

                console.log('Closed search dropdown before BHK filter');
            }
        } catch {}

        await this.page.keyboard.press('Escape');

        await this.page.waitForTimeout(300);

        try {
            const heading = this.page.locator('h1').first();

            if (await heading.isVisible({ timeout: 1000 })) {
                await heading.click({ force: true });

                await this.page.waitForTimeout(300);
            }
        } catch {
            await this.page.mouse.click(640, 400);

            await this.page.waitForTimeout(300);
        }

        await this.page.mouse.wheel(0, 1000);

        await this.page.waitForTimeout(1000);

        const allBHKElements = this.page.getByText(bhkType, {
            exact: true
        });

        const count = await allBHKElements.count();

        let clicked = false;

        for (let i = 0; i < count; i++) {
            const element = allBHKElements.nth(i);

            try {
                if (await element.isVisible()) {
                    await element.click({ timeout: 3000 });

                    clicked = true;

                    console.log(
                        `Applied ${bhkType} filter (element #${i})`
                    );

                    break;
                }
            } catch {
                continue;
            }
        }

        if (!clicked) {
            await this.page.mouse.wheel(0, 1500);

            await this.page.waitForTimeout(1000);

            const retryElements = this.page.getByText(bhkType, {
                exact: true
            });

            const retryCount = await retryElements.count();

            for (let i = 0; i < retryCount; i++) {
                const element = retryElements.nth(i);

                try {
                    if (await element.isVisible()) {
                        await element.click({ timeout: 3000 });

                        clicked = true;

                        console.log(
                            `Applied ${bhkType} filter on retry (element #${i})`
                        );

                        break;
                    }
                } catch {
                    continue;
                }
            }
        }

        if (!clicked) {
            throw new Error(
                `Could not find a visible "${bhkType}" element to click after scrolling`
            );
        }

        await this.page.waitForLoadState('networkidle');
    }

    async getPropertyCount(): Promise<number> {
        await this.propertyCards.first().waitFor({
            state: 'visible',
            timeout: 30000
        });

        const count = await this.propertyCards.count();

        console.log(`Property count: ${count}`);

        return count;
    }

    async getAllPropertyTitles(): Promise<string[]> {
        const titles: string[] = [];

        const count = await this.propertyCardTitles.count();

        for (let i = 0; i < count; i++) {
            const title = await this.propertyCardTitles
                .nth(i)
                .textContent();

            if (title) {
                titles.push(title.trim());
            }
        }

        return titles;
    }

    async verifyCardsContainBHK(
        expectedBHK: string
    ): Promise<boolean> {
        const titles = await this.getAllPropertyTitles();

        const bhkNumber = expectedBHK.split(' ')[0];

        let matchCount = 0;

        for (const title of titles) {
            if (
                title.includes(expectedBHK) ||
                title.includes(`${bhkNumber} BHK`)
            ) {
                matchCount++;
            }
        }

        console.log(
            `${matchCount}/${titles.length} properties match ${expectedBHK}`
        );

        return matchCount > 0;
    }

    async clickPropertyCard(index: number): Promise<void> {
        await this.propertyCards.nth(index).click();

        await this.page.waitForLoadState('networkidle');

        console.log(`Clicked property card at index ${index}`);
    }

    async sortProperties(sortBy: string): Promise<void> {
        await this.sortDropdown.selectOption({
            label: sortBy
        });

        await this.page.waitForLoadState('networkidle');

        console.log(`Sorted by: ${sortBy}`);
    }

    async loadMoreProperties(): Promise<void> {
        if (await this.loadMore.isVisible()) {
            await this.loadMore.click();

            await this.page.waitForLoadState('networkidle');

            console.log('Loaded more properties');
        } else {
            console.log('Load More button not available');
        }
    }

    async goToNextPage(): Promise<void> {
        if (await this.paginationNext.isVisible()) {
            await this.paginationNext.click();

            await this.page.waitForLoadState('networkidle');

            console.log('Navigated to next page');
        } else {
            console.log('Next page button not available');
        }
    }

    async getFirstPropertyDetails(): Promise<{
        title: string | null;
        price: string | null;
        location: string | null;
    }> {
        const title = await this.propertyCardTitles
            .first()
            .textContent();

        let price: string | null = null;

        let location: string | null = null;

        try {
            price = await this.page
                .locator('text=/₹/')
                .first()
                .textContent();
        } catch {}

        try {
            location = await this.page
                .locator('text=/Jaipur/')
                .first()
                .textContent();
        } catch {}

        return {
            title: title?.trim() || null,
            price: price?.trim() || null,
            location: location?.trim() || null
        };
    }
}