import { expect, test } from '@/fixtures/common.fixtures';
import { EmployeesPage } from '@/pages/admin/EmployeesPage';
import { AddEmployeeFormPage } from '@/pages/admin/AddEmployeeFormPage';
import { EmployeeColumn, EmployeeRowAction } from '@/constants/EmployeeConstants';
import { Employee } from '@/model/Employee';
import { TestLogger } from '@/utils/TestLogger';

export class EmployeesSteps {
    private employeesPage: EmployeesPage;
    private addEmployeeFormPage: AddEmployeeFormPage;

    constructor(employeesPage: EmployeesPage, addEmployeeFormPage: AddEmployeeFormPage) {
        this.employeesPage = employeesPage;
        this.addEmployeeFormPage = addEmployeeFormPage;
    }

    async verifyEmployeesPageIsLoaded(): Promise<void> {
        await test.step('Verify employees page is loaded', async () => {
            await this.employeesPage.verifyPageIsLoaded();
        });
    }

    async clickAddEmployeeButton(): Promise<void> {
        await test.step('Open add employee form', async () => {
            await this.employeesPage.clickAddEmployeeButton();
        });
    }

    async createEmployee(employee: Employee): Promise<void> {
        await test.step(`Create employee: ${employee.email}`, async () => {
            await this.addEmployeeFormPage.verifyPageIsLoaded();
            await this.addEmployeeFormPage.fillLastName(employee.lastName);
            await this.addEmployeeFormPage.fillFirstName(employee.firstName);
            await this.addEmployeeFormPage.fillEmail(employee.email);
            await this.addEmployeeFormPage.fillPhone(employee.phone);
            await this.addEmployeeFormPage.fillPassword(employee.password);
            await this.addEmployeeFormPage.selectAccess(employee.access);
            employee.department = await this.addEmployeeFormPage.grantRightToFirstDepartment(employee.right);
            await this.addEmployeeFormPage.clickSave();

            TestLogger.logUi(`Employee created: ${employee.email}`);
        });
    }

    async searchForEmployee(keyword: string): Promise<void> {
        await test.step(`Search for employee: ${keyword}`, async () => {
            await this.employeesPage.search(keyword);
        });
    }

    async clickClearFilters(): Promise<void> {
        await test.step('Click clear filters', async () => {
            await this.employeesPage.clickClearFilters();
        });
    }

    async toggleFilters(): Promise<void> {
        await test.step('Toggle filters panel', async () => {
            await this.employeesPage.clickFiltersToggle();
        });
    }

    async downloadEmployeesTable(): Promise<void> {
        await test.step('Download employees table', async () => {
            await this.employeesPage.clickDownloadTable();
        });
    }

    async sortEmployeesBy(column: EmployeeColumn): Promise<void> {
        await test.step(`Sort employees by: ${column}`, async () => {
            await this.employeesPage.clickSortByColumn(column);
        });
    }

    async openEmployeeDetails(name: string): Promise<void> {
        await test.step(`Open employee details: ${name}`, async () => {
            await this.employeesPage.clickEmployeeRow(name);
        });
    }

    async deactivateEmployee(name: string): Promise<void> {
        await test.step(`Deactivate employee: ${name}`, async () => {
            await this.employeesPage.selectRowAction(name, EmployeeRowAction.DEACTIVATE);
        });
    }

    async activateEmployee(name: string): Promise<void> {
        await test.step(`Activate employee: ${name}`, async () => {
            await this.employeesPage.selectRowAction(name, EmployeeRowAction.ACTIVATE);
        });
    }

    async goToNextPage(): Promise<void> {
        await test.step('Go to next employees page', async () => {
            await this.employeesPage.clickNextPage();
        });
    }

    async goToPreviousPage(): Promise<void> {
        await test.step('Go to previous employees page', async () => {
            await this.employeesPage.clickPreviousPage();
        });
    }

    async verifyEmployeeIsListed(name: string): Promise<void> {
        await test.step(`Verify employee is listed: ${name}`, async () => {
            await expect(this.employeesPage.getEmployeeRow(name)).toBeVisible();
        });
    }

    async verifyEmployeeIsNotListed(name: string): Promise<void> {
        await test.step(`Verify employee is not listed: ${name}`, async () => {
            await expect(this.employeesPage.getEmployeeRow(name)).not.toBeVisible();
        });
    }

    async verifyEmployeeCount(expected: number): Promise<void> {
        await test.step(`Verify employees list shows ${expected} result(s)`, async () => {
            const count = await this.employeesPage.getEmployeesCount();
            expect(count).toBe(expected);
        });
    }

    async verifyEmployeeRowDetails(employee: Employee): Promise<void> {
        await test.step(`Verify row details for employee: ${employee.email}`, async () => {
            await expect(this.employeesPage.getEmployeeRowUsername(employee.email)).toContainText(employee.firstName);
            await expect(this.employeesPage.getEmployeeRowUsername(employee.email)).toContainText(employee.lastName);
            await expect(this.employeesPage.getEmployeeRowEmail(employee.email)).toHaveText(employee.email);
            await expect(this.employeesPage.getEmployeeRowAccess(employee.email)).toHaveText(employee.access);
            await expect(this.employeesPage.getEmployeeRowDepartment(employee.email)).toHaveText(employee.department ?? '--');
            await expect(this.employeesPage.getEmployeeRowLastEdited(employee.email)).toContainText(employee.lastUpdatedDate!);
            await expect(this.employeesPage.getEmployeeRowStatus(employee.email)).toHaveText(employee.status!.toLowerCase());
        });
    }
}
