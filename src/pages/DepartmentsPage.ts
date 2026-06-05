import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/BasePage';
import { DepartmentSectionTab } from '@/constants/DepartmentConstants';

export class DepartmentsPage extends BasePage {
    private readonly pageHeading: Locator;
    private readonly addDepartmentButton: Locator;
    private readonly departmentsTable: Locator;
    private readonly searchInput: Locator;
    private readonly clearFiltersButton: Locator;

    constructor(page: Page) {
        super(page);
        const main = page.getByRole('main');

        this.pageHeading = page.getByRole('heading', { name: 'Compartimente' });
        this.addDepartmentButton = main.getByRole('button', { name: 'Adaugă Compartiment' });
        this.departmentsTable = main.getByRole('table');
        this.searchInput = main.getByRole('textbox', { name: 'Caută' });
        this.clearFiltersButton = page.getByRole('button', { name: 'Șterge filtrele' });
    }

    async selectParentDepartment(parent: DepartmentSectionTab): Promise<void> {
        await this.page.getByRole('link', { name: parent }).click();
    }

    async verifyPageIsLoaded(): Promise<void> {
        await this.expectElementToBeDisplayed(this.pageHeading);
    }

    async clickAddDepartment(): Promise<void> {
        await this.addDepartmentButton.click();
    }

    async search(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
        await this.page.waitForLoadState('networkidle');
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

    getDepartmentRowCell(name: string, columnIndex: number): Locator {
        return this.getDepartmentRow(name).getByRole('cell').nth(columnIndex);
    }

    getDepartmentRowName(name: string): Locator {
        return this.getDepartmentRowCell(name, 0);
    }

    getDepartmentRowType(name: string): Locator {
        return this.getDepartmentRowCell(name, 1);
    }

    getDepartmentRowParent(name: string): Locator {
        return this.getDepartmentRowCell(name, 2);
    }

    getDepartmentRowStatus(name: string): Locator {
        return this.getDepartmentRowCell(name, 5);
    }

    getDepartmentRowClerks(name: string): Locator {
        return this.getDepartmentRowCell(name, 3);
    }

    getDepartmentRowLastEdited(name: string): Locator {
        return this.getDepartmentRowCell(name, 4);
    }

    async clickClearFilters(): Promise<void> {
        await this.clearFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getVisibleRowCount(): Promise<number> {
        await this.page.waitForLoadState('networkidle');
        return await this.departmentsTable.locator('tr:has(div)').count();
    }
}
