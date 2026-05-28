import { Page } from '@playwright/test';
import { test } from '@/fixtures/common.fixtures';
import { BasePage } from '@/pages/BasePage';

export class GeneralSteps {
    private basePage: BasePage;

    constructor(page: Page) {
        this.basePage = new BasePage(page);
    }

    async verifyUserIsOnPage(url: string | RegExp): Promise<void> {
        await test.step(`Verify user is on page: ${url}`, async () => {
            await this.basePage.verifyUserIsOnPage(url);
        });
    }
}
