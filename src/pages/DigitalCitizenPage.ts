import { expect, Locator, Page } from "@playwright/test";
import { Routes } from "@/routes/routes";
import { MenuOptions } from "@/constants/DigitalCitizenConstants";
import { BasePage } from "./BasePage";


export class DigitalCitizenPage extends BasePage {
    private userGreetingBanner: Locator;

    constructor(page: Page) {
        super(page);
        this.userGreetingBanner = page.getByRole('heading', { name: 'Bine ai venit în contul tău' });
    }

    async goto(): Promise<void> {
        await this.page.goto(`${process.env.FIWMARE_URL}${Routes.DIGITAL_CITIZEN_DASHBOARD}`);
    }

    async verifyUserIsGreeted(username: string): Promise<void> {
        await expect(this.userGreetingBanner).toContainText(username);
    }

    async selectApplicationSelfTab(name: string): Promise<void> {
        const link: Locator = this.page.getByRole('link', { name });
        await this.removeLocatorAttribute(link, 'target');
        await link.click();
    }

    async selectMenuOption(option: MenuOptions): Promise<void> {
        const menuItem: Locator = this.page.getByText(option);
        await expect(menuItem).toBeVisible();
        await menuItem.click();
    }

}