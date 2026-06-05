import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { AdminSettingsOption, NavItem, UserAccountOption } from "@/constants/HeaderConstants";

export class HeaderPage extends BasePage {
    private readonly header: Locator;
    private readonly logo: Locator;
    private readonly mobileMenuButton: Locator;
    private readonly settingsButton: Locator;
    private readonly userMenuButton: Locator;
    private readonly languageSelector: Locator;
    private readonly notificationsButton: Locator;

    constructor(page: Page) {
        super(page);
        this.header = page.locator('header').first();
        this.logo = this.header.locator('img[src*="logo"]');
        this.mobileMenuButton = this.header.getByRole('button', { name: 'account of current user' });
        this.settingsButton = this.header.getByRole('button', { name: 'Deschideți setările', exact: true });
        this.userMenuButton = this.header.getByRole('button', { name: 'Deschideți setările de administrator' });
        this.languageSelector = this.header.locator('[aria-label="Schimbă limba"]');
        this.notificationsButton = this.header.getByRole('button', { name: 'Deschideți notificările' });
    }

    async clickLogo(): Promise<void> {
        await this.logo.click();
    }

    async clickNavItem(item: NavItem): Promise<void> {
        await this.header.getByText(item, { exact: true }).click();
    }

    async clickUserSettingsButton(): Promise<void> {
        await this.settingsButton.click();
    }

    async clickUserMenuButton(): Promise<void> {
        await this.userMenuButton.click();
    }

    async clickLanguageSelector(): Promise<void> {
        await this.languageSelector.click();
    }

    async selectLanguage(lang: string): Promise<void> {
    }

    async clickNotificationsButton(): Promise<void> {
        await this.notificationsButton.click();
    }

    async selectAdminSettingsOption(item: AdminSettingsOption): Promise<void> {
        await this.page.getByRole('menuitem', { name: item as string, exact: true }).click();
    }

    async selectUserAccountOption(item: UserAccountOption): Promise<void> {
        await this.clickUserMenuButton();
        await this.page.getByRole('menuitem', { name: item as string, exact: true }).click();
    }

    async clickMobileMenuButton() {
        await this.mobileMenuButton.click()
    }
}
