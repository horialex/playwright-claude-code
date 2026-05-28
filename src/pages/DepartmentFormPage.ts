import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/BasePage';
import { DepartmentType } from '@/model/Department';

export class DepartmentFormPage extends BasePage {
    private readonly pageHeading: Locator;
    private readonly nameInput: Locator;
    private readonly typeSelect: Locator;
    private readonly parentSelect: Locator;
    private readonly descriptionTextarea: Locator;
    private readonly cancelButton: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        const main = page.getByRole('main');

        this.pageHeading = page.getByRole('heading', { name: 'Adaugă compartiment' });
        this.nameInput = main.locator('label:has-text("Nume compartiment") + div input');
        this.typeSelect = main.locator('label:has-text("Tip compartiment") + div [role="combobox"]');
        this.parentSelect = main.locator('label:has-text("Inclus în") + div [role="combobox"]');
        this.descriptionTextarea = main.locator('label:has-text("Descriere compartiment") + div textarea:not([aria-hidden="true"])');
        this.cancelButton = main.getByRole('button', { name: 'Renunță' });
        this.saveButton = main.getByRole('button', { name: 'Salvează' });
    }

    async verifyPageIsLoaded(): Promise<void> {
        await this.expectElementToBeDisplayed(this.pageHeading);
    }

    async fillName(name: string): Promise<void> {
        await this.nameInput.fill(name);
    }

    async selectType(type: DepartmentType): Promise<void> {
        await this.typeSelect.click();
        await this.page.getByRole('option', { name: type }).click();
    }

    async selectParent(parent: string): Promise<void> {
        await this.parentSelect.click();
        await this.page.getByRole('option', { name: parent }).click();
    }

    async fillDescription(description: string): Promise<void> {
        await this.descriptionTextarea.fill(description);
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
}
