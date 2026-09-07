import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/BasePage';
import { EmployeeAccess, ResolutionRight } from '@/model/Employee';

export class AddEmployeeFormPage extends BasePage {
    private readonly pageHeading: Locator;
    private readonly lastNameInput: Locator;
    private readonly firstNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly phoneInput: Locator;
    private readonly passwordInput: Locator;
    private readonly accessSelect: Locator;
    private readonly activeResolutionPanel: Locator;
    private readonly cancelButton: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        const main = page.getByRole('main');

        this.pageHeading = page.getByRole('heading', { name: 'Adaugă angajat' });
        this.lastNameInput = main.locator('label:text-matches("^Nume") + div input');
        this.firstNameInput = main.locator('label:text-matches("^Prenume") + div input');
        this.emailInput = main.locator('label:text-matches("^Adresă email") + div input');
        this.phoneInput = main.locator('label:text-matches("^Număr telefon") + div input');
        this.passwordInput = main.locator('label:text-matches("^Parolă") + div input');
        this.accessSelect = main.locator('label:text-matches("^Acces în aplicație") + div [role="combobox"]');
        this.activeResolutionPanel = main.getByRole('tabpanel');
        this.cancelButton = main.getByRole('button', { name: 'Renunță' });
        this.saveButton = main.getByRole('button', { name: 'Salvează' });
    }

    async verifyPageIsLoaded(): Promise<void> {
        await this.expectElementToBeDisplayed(this.pageHeading);
    }

    async fillLastName(lastName: string): Promise<void> {
        await this.lastNameInput.fill(lastName);
    }

    async fillFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async fillPhone(phone: string): Promise<void> {
        await this.phoneInput.fill(phone);
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async selectAccess(access: EmployeeAccess): Promise<void> {
        await this.accessSelect.click();
        await this.page.getByRole('option', { name: access }).click();
    }

    /**
     * Grants the given right to the first department listed in the active module tab
     * and returns that department's name.
     *
     * An employee must have at least one resolution right to be saved; the specific
     * department is not significant for the create flow, so the first one is used.
     * The returned name lets callers assert the department shown in the employees table.
     */
    async grantRightToFirstDepartment(right: ResolutionRight): Promise<string> {
        // A department row pairs its checkbox label (the name) with a rights radiogroup.
        const firstDepartment = this.activeResolutionPanel
            .locator('div:has(> label):has([role="radiogroup"])')
            .first();
        const departmentName = (await firstDepartment.locator('> label').innerText()).trim();
        await firstDepartment.getByRole('radio', { name: right }).check();
        return departmentName;
    }

    async clickSave(): Promise<void> {
        await this.saveButton.click();
        await this.page.waitForURL(url => !url.pathname.includes('addusers'));
    }

    async clickCancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async isSaveEnabled(): Promise<boolean> {
        return this.isElementClickable(this.saveButton);
    }
}
