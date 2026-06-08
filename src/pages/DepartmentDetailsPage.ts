import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/BasePage';

export class DepartmentDetailsPage extends BasePage {
    private readonly sectionHeading: Locator;
    private readonly pageTitle: Locator;
    private readonly nameInput: Locator;
    private readonly typeSelect: Locator;
    private readonly parentSelect: Locator;
    private readonly descriptionTextarea: Locator;
    private readonly cancelButton: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        const main = page.getByRole('main');

        this.sectionHeading = page.getByRole('heading', { name: 'Informații compartiment' });
        this.pageTitle = page.getByRole('heading', { level: 5 });
        this.nameInput = main.locator('label:has-text("Nume compartiment") + div input');
        this.typeSelect = main.locator('label:has-text("Tip compartiment") + div [role="combobox"]');
        this.parentSelect = main.locator('label:has-text("Inclus în") + div [role="combobox"]');
        this.descriptionTextarea = main.locator('label:has-text("Descriere compartiment") + div textarea:not([aria-hidden="true"])');
        this.cancelButton = main.getByRole('button', { name: 'Renunță' });
        this.saveButton = main.getByRole('button', { name: 'Salvează' });
    }

    async verifyPageIsLoaded(): Promise<void> {
        await this.expectElementToBeDisplayed(this.sectionHeading);
    }

    async getPageTitle(): Promise<string> {
        return this.pageTitle.innerText();
    }

    getModuleBadge(moduleName: string): Locator {
        return this.page.getByRole('main').locator('form').getByText(moduleName, { exact: true });
    }

    async fillName(name: string): Promise<void> {
        await this.nameInput.fill(name);
    }

    async fillDescription(description: string): Promise<void> {
        await this.descriptionTextarea.fill(description);
    }

    async getName(): Promise<string> {
        return this.nameInput.inputValue();
    }

    async getDescription(): Promise<string> {
        return this.descriptionTextarea.inputValue();
    }

    async clickSave(): Promise<void> {
        await this.saveButton.click();
    }

    async clickCancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async isSaveEnabled(): Promise<boolean> {
        return this.isElementClickable(this.saveButton);
    }

    async verifyTypeIsDisabled(): Promise<void> {
        await this.expectElementToBeDisabled(this.typeSelect);
    }

    async verifyParentIsDisabled(): Promise<void> {
        await this.expectElementToBeDisabled(this.parentSelect);
    }
}
