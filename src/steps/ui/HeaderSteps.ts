import { test } from '@/fixtures/common.fixtures';
import { HeaderPage } from '@/pages/HeaderPage';
import { AdminSettingsOption, NavItem, UserAccountOption } from '@/constants/HeaderConstants';

export class HeaderSteps {
    private headerPage: HeaderPage;

    constructor(headerPage: HeaderPage) {
        this.headerPage = headerPage;
    }

    async openSection(item: NavItem): Promise<void> {
        await test.step(`Open section: ${item}`, async () => {
            await this.headerPage.clickNavItem(item);
        });
    }

    async selectAdminSettingsOption(option: AdminSettingsOption): Promise<void> {
        await test.step(`Open admin settings: ${option}`, async () => {
            await this.headerPage.clickUserSettingsButton();
            await this.headerPage.selectAdminSettingsOption(option);
        });
    }

    async openUserAccountMenu(option: UserAccountOption): Promise<void> {
        await test.step(`Select user account option: ${option}`, async () => {
            await this.headerPage.selectUserAccountOption(option);
        });
    }

    async clickLogo(): Promise<void> {
        await test.step('Click header logo', async () => {
            await this.headerPage.clickLogo();
        });
    }

    async openNotifications(): Promise<void> {
        await test.step('Open notifications', async () => {
            await this.headerPage.clickNotificationsButton();
        });
    }

    async changeLanguage(lang: string): Promise<void> {
        await test.step(`Select language ${lang}`, async () => {
            await this.headerPage.clickLanguageSelector();
            await this.headerPage.selectLanguage(lang);
        });
    }
}
