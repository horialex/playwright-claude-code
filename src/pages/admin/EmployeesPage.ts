import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/BasePage';
import { EmployeeColumn, EmployeeRowAction } from '@/constants/EmployeeConstants';

export class EmployeesPage extends BasePage {
    private readonly pageHeading: Locator;
    private readonly addEmployeeButton: Locator;
    private readonly employeesTable: Locator;
    private readonly searchInput: Locator;
    private readonly clearFiltersButton: Locator;
    private readonly filtersToggleButton: Locator;
    private readonly downloadTableButton: Locator;
    private readonly employeesCountLabel: Locator;
    private readonly nextPageButton: Locator;
    private readonly previousPageButton: Locator;

    constructor(page: Page) {
        super(page);
        const main = page.getByRole('main');

        this.pageHeading = page.getByRole('heading', { name: 'Angajați' });
        this.addEmployeeButton = main.getByRole('button', { name: 'Adaugă angajat' });
        this.employeesTable = main.getByRole('table');
        this.searchInput = main.getByRole('textbox', { name: 'Caută' });
        this.clearFiltersButton = page.getByRole('button', { name: 'Șterge filtrele' });
        this.filtersToggleButton = main.locator('button:has(svg[data-testid="ExpandLessIcon"]), button:has(svg[data-testid="ExpandMoreIcon"])');
        this.downloadTableButton = main.getByRole('button', { name: 'Descarcă tabel' });
        this.employeesCountLabel = main.getByText(/Angajați\s+\(\d+\)/);
        this.nextPageButton = main.getByRole('button', { name: 'Următor' }).last();
        this.previousPageButton = main.getByRole('button', { name: 'Anterior' }).last();
    }

    async verifyPageIsLoaded(): Promise<void> {
        await this.expectElementToBeDisplayed(this.pageHeading);
    }

    async clickAddEmployeeButton(): Promise<void> {
        await this.addEmployeeButton.click();
    }

    async search(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
        await expect(this.clearFiltersButton).toBeEnabled();
    }

    async clickClearFilters(): Promise<void> {
        await this.clearFiltersButton.click();
        await expect(this.clearFiltersButton).toBeDisabled();
    }

    async clickFiltersToggle(): Promise<void> {
        await this.filtersToggleButton.click();
    }

    async clickDownloadTable(): Promise<void> {
        await this.downloadTableButton.click();
    }

    async clickSortByColumn(column: EmployeeColumn): Promise<void> {
        await this.employeesTable.getByRole('columnheader', { name: column }).getByRole('button').click();
    }

    async clickEmployeeRow(name: string): Promise<void> {
        await this.getEmployeeRow(name).first().click();
    }

    async openRowActionsMenu(name: string): Promise<void> {
        await this.getEmployeeRow(name).getByRole('button', { name: 'more' }).click();
    }

    async selectRowAction(name: string, action: EmployeeRowAction): Promise<void> {
        await this.openRowActionsMenu(name);
        await this.page.getByRole('menuitem', { name: action }).click();
    }

    getEmployeeRow(name: string): Locator {
        return this.employeesTable.getByRole('row', { name });
    }

    getEmployeeRowCell(name: string, columnIndex: number): Locator {
        return this.getEmployeeRow(name).getByRole('cell').nth(columnIndex);
    }

    getEmployeeRowUsername(name: string): Locator {
        return this.getEmployeeRowCell(name, 0);
    }

    getEmployeeRowEmail(name: string): Locator {
        return this.getEmployeeRowCell(name, 1);
    }

    getEmployeeRowAccess(name: string): Locator {
        return this.getEmployeeRowCell(name, 2);
    }

    getEmployeeRowDepartment(name: string): Locator {
        return this.getEmployeeRowCell(name, 3);
    }

    getEmployeeRowLastEdited(name: string): Locator {
        return this.getEmployeeRowCell(name, 4);
    }

    getEmployeeRowStatus(name: string): Locator {
        return this.getEmployeeRowCell(name, 5);
    }

    async clickNextPage(): Promise<void> {
        await this.nextPageButton.click();
    }

    async clickPreviousPage(): Promise<void> {
        await this.previousPageButton.click();
    }

    async getEmployeesCount(): Promise<number> {
        const label = await this.employeesCountLabel.innerText();
        const match = label.match(/\((\d+)\)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    async getVisibleRowCount(): Promise<number> {
        return await this.employeesTable.locator('tbody tr').filter({ has: this.page.locator('div') }).count();
    }
}
