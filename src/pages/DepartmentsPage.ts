import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/BasePage';

export class DepartmentsPage extends BasePage {
    private readonly pageHeading: Locator;
    private readonly addDepartmentButton: Locator;
    private readonly departmentsTable: Locator;
    private readonly searchInput: Locator;

    constructor(page: Page) {
        super(page);
        const main = page.getByRole('main');

        this.pageHeading = page.getByRole('heading', { name: 'Compartimente' });
        this.addDepartmentButton = main.getByRole('button', { name: 'Adaugă Compartiment' });
        this.departmentsTable = main.getByRole('table');
        this.searchInput = main.getByRole('textbox', { name: 'Caută' });
    }

    async verifyPageIsLoaded(): Promise<void> {
        await this.expectElementToBeDisplayed(this.pageHeading);
    }

    async clickAddDepartment(): Promise<void> {
        await this.addDepartmentButton.click();
    }

    async search(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
    }

    async clickEditDepartment(name: string): Promise<void> {
        const row = this.departmentsTable.getByRole('row', { name });
        await row.getByRole('button', { name: 'Editează' }).click();
    }

    async clickDeleteDepartment(name: string): Promise<void> {
        const row = this.departmentsTable.getByRole('row', { name });
        await row.getByRole('button', { name: 'Șterge' }).click();
    }

    getDepartmentRow(name: string): Locator {
        return this.departmentsTable.getByRole('row', { name });
    }
}
