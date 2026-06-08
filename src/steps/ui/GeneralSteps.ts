import { Page } from '@playwright/test';
import { test } from '@/fixtures/common.fixtures';
import { BasePage } from '@/pages/BasePage';

export class GeneralSteps {
    private basePage: BasePage;

    constructor(page: Page) {
        this.basePage = new BasePage(page);
    }

    async verifyUserIsOnPage(urlPart: string): Promise<void> {
        await test.step(`Verify user is on page: ${urlPart}`, async () => {
            await this.basePage.verifyUserIsOnPage(new RegExp(urlPart));
        });
    }
}
