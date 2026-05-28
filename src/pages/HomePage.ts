import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {

    constructor(page: Page) {
        super(page)
    }

    async verifyUserIsOnHomePage(emailPrefix: string) {
        await expect(this.page.getByText(emailPrefix)).toBeVisible();
    }
}
