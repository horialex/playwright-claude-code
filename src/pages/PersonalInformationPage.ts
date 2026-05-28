import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { UserPersonalInformation } from "@/model/User";


export class PersonalInformationPage extends BasePage {
    readonly editAccountButton: Locator;
    readonly userNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.editAccountButton = page.locator("a.panel-heading div[class$='edit']");
        this.userNameInput = page.locator('#id_username');
        this.lastNameInput = page.locator('#last_name');
        this.saveButton = page.locator("button#update_user");
    }

    async clickEditAccountButon(): Promise<void> {
        await expect(this.editAccountButton).toBeVisible();
        await expect(this.editAccountButton).toBeEnabled();

        await this.page.waitForLoadState('networkidle');
        await this.editAccountButton.click();
    }

    async fillUserName(userName: string): Promise<void> {
        await this.userNameInput.fill(userName);
    }

    async fillLastName(lastName: string): Promise<void> {
        await this.lastNameInput.fill(lastName);
    }

    async clickSaveButton(): Promise<void> {
        await this.saveButton.click();
    }

    async updatePersonalInformation(userPersonalInfo: UserPersonalInformation): Promise<void> {
        await this.fillUserName(userPersonalInfo.userName!);
        await this.fillLastName(userPersonalInfo.lastName!);
        await this.clickSaveButton();
    }

}