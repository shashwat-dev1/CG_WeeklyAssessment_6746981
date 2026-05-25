import { Locator, Page } from '@playwright/test';
import fs from 'fs';

const loginData = JSON.parse(
    fs.readFileSync('./dataset/login.json', 'utf-8')
);

export class LoginPage {
    page: Page;
    page2: Page;
    loginHover: Locator;
    loginSignUp: Locator;
    mobileNo: Locator;
    nextButton: Locator;
    continueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.page2 = page;

        this.loginHover = page.getByText('Login', { exact: true });

        this.loginSignUp = page.getByText('Login/Sign Up');

        this.mobileNo = this.page2.locator('#emailOrMobileLable');

        this.nextButton = this.page2.getByText('Next');

        this.continueButton = this.page2.getByText('Continue');
    }

    async login(): Promise<void> {
        await this.loginHover.last().hover();

        const [page2] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.loginSignUp.click()
        ]);

        await page2.waitForLoadState('networkidle');

        await page2
            .locator('#emailOrMobileLable')
            .fill(loginData.mobile);

        console.log('Paused: Please solve CAPTCHA manually');

        await page2.pause();

        await page2.getByText('Next').click();

        console.log('Paused: Please enter OTP manually');

        await page2.pause();

        await page2
            .locator("//button[@onclick='verifyOtp()']")
            .click();

        console.log('Login completed');
    }

    async loginAndReturnPage(): Promise<Page> {
        await this.loginHover.last().hover();

        const [page2] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.loginSignUp.click()
        ]);

        await page2.waitForLoadState('networkidle');

        this.page2 = page2;

        return page2;
    }

    async LoginAction(): Promise<void> {
        await this.page2
            .locator('#emailOrMobileLable')
            .fill(loginData.mobile);

        console.log('Paused: Please solve CAPTCHA manually');

        await this.page2.pause();

        await this.page2.getByText('Next').click();

        console.log('Paused: Please enter OTP manually');

        await this.page2.pause();

        await this.page2
            .locator("//button[@onclick='verifyOtp()']")
            .click();

        console.log('Login action completed');
    }
}

export default LoginPage;