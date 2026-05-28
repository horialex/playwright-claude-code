import { APIRequestContext, test as base, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { DigitalCitizenPage } from '@/pages/DigitalCitizenPage';
import { PersonalInformationPage } from '@/pages/PersonalInformationPage';

type MyFixtures = {
    context: BrowserContext;
    page: Page;
    apiRequest: APIRequestContext;
    loginPage: LoginPage;
    digitalCitizenPage: DigitalCitizenPage;
    homePage: HomePage;
    personalInformationPage: PersonalInformationPage;
};

export const test = base.extend<MyFixtures>({
    context: async ({ browser }, use) => {
        const context = await browser.newContext({
            ignoreHTTPSErrors: true,
        });
        await use(context);
        await context.close();
    },

    page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
        await page.close();
    },



    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    digitalCitizenPage: async ({ page }, use) => {
        const digitalCitizenPage = new DigitalCitizenPage(page);
        await use(digitalCitizenPage);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    personalInformationPage: async ({ page }, use) => {
        await use(new PersonalInformationPage(page));
    },

});

export { expect } from '@playwright/test';
