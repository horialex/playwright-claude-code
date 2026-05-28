import {
    Page, test as base,
} from '@playwright/test';

type BaseFixtures = {
    page: Page;
};

export const baseTest = base.extend<BaseFixtures>({
    page: async ({ context }, use) => {
        const page = await context.newPage();

        await use(page);
        await page.close();
    },
});
