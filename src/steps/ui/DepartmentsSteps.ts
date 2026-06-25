import { expect, test } from '@/fixtures/common.fixtures';
import { DepartmentsPage } from '@/pages/DepartmentsPage';
import { DepartmentFormPage } from '@/pages/DepartmentFormPage';
import { DepartmentDetailsPage } from '@/pages/DepartmentDetailsPage';
import { Department } from '@/model/Department';
import { TestLogger } from '@/utils/TestLogger';
import { DepartmentModule } from '@/constants/DepartmentConstants';
import { DepartmentParentPages } from '@/routes/routes';

export class DepartmentsSteps {
    private departmentsPage: DepartmentsPage;
    private departmentFormPage: DepartmentFormPage;
    private departmentDetailsPage: DepartmentDetailsPage;

    constructor(departmentsPage: DepartmentsPage, departmentFormPage: DepartmentFormPage, departmentDetailsPage: DepartmentDetailsPage) {
        this.departmentsPage = departmentsPage;
        this.departmentFormPage = departmentFormPage;
        this.departmentDetailsPage = departmentDetailsPage;
    }

    async navigateToDepartmentParent(parent: keyof typeof DepartmentParentPages): Promise<void> {
        await test.step(`Navigate to department parent: ${parent}`, async () => {
            await this.departmentsPage.page.goto(DepartmentParentPages[parent]);
        });
    }

    async selectDepartmentTab(parent: DepartmentModule): Promise<void> {
        await test.step(`Select department parent: ${parent}`, async () => {
            await this.departmentsPage.selectParentDepartment(parent);
        });
    }

    async verifyDepartmentsPageIsLoaded(): Promise<void> {
        await test.step('Verify departments page is loaded', async () => {
            await this.departmentsPage.verifyPageIsLoaded();
        });
    }

    async searchForDepartment(name: string): Promise<void> {
        await test.step(`Search for department: ${name}`, async () => {
            await this.departmentsPage.search(name);
        });
    }

    async clickAddDepartmentButton(): Promise<void> {
        await test.step('Open add department form', async () => {
            await this.departmentsPage.clickAddDepartment();
        });
    }

    async openEditDepartmentForm(name: string): Promise<void> {
        await test.step(`Open edit form for department: ${name}`, async () => {
            await this.departmentsPage.clickEditDepartment(name);
        });
    }

    async deleteDepartment(name: string): Promise<void> {
        await test.step(`Delete department: ${name}`, async () => {
            await this.departmentsPage.clickDeleteDepartment(name);
        });
    }

    async verifyDepartmentIsListed(name: string): Promise<void> {
        await test.step(`Verify department is listed: ${name}`, async () => {
            await expect(this.departmentsPage.getDepartmentRow(name)).toBeVisible();
        });
    }

    async verifyDepartmentIsNotListed(name: string): Promise<void> {
        await test.step(`Verify department is not listed: ${name}`, async () => {
            await expect(this.departmentsPage.getDepartmentRow(name)).not.toBeVisible();
        });
    }

    async clickClearFilters(): Promise<void> {
        await test.step('Click clear filters', async () => {
            await this.departmentsPage.clickClearFilters();
        });
    }

    async toggleFilters(): Promise<void> {
        await test.step('Toggle filters panel', async () => {
            await this.departmentsPage.clickFiltersToggle();
        });
    }

    async verifyDepartmentCount(expected: number): Promise<void> {
        await test.step(`Verify department list shows ${expected} result(s)`, async () => {
            const count = await this.departmentsPage.getVisibleRowCount();
            expect(count).toBe(expected);
        });
    }

    async verifyMultipleDepartmentsListed(): Promise<void> {
        await test.step('Verify multiple departments are listed', async () => {
            await expect(async () => {
                const count = await this.departmentsPage.getVisibleRowCount();
                expect(count).toBeGreaterThan(1);
            }).toPass({ timeout: 10000 });
        });
    }

    async verifyDepartmentRowDetails(department: Department): Promise<void> {
        await test.step(`Verify row details for department: ${department.name}`, async () => {

            await expect(this.departmentsPage.getDepartmentRowName(department.name)).toHaveText(department.name);
            await expect(this.departmentsPage.getDepartmentRowType(department.type)).toHaveText(department.type);
            await expect(this.departmentsPage.getDepartmentRowParent(department.name)).toHaveText(department.parent ?? '--');
            await expect(this.departmentsPage.getDepartmentRowClerks(department.name)).toHaveText(department.clerks!.length === 0 ? '--' : String(department.clerks!.length));
            await expect(this.departmentsPage.getDepartmentRowLastEdited(department.name)).toContainText(department.lastUpdatedDate!);
            await expect(this.departmentsPage.getDepartmentRowStatus(department.name)).toHaveText(department.status!);
        });
    }

    async fillDepartmentFormFields(department: Department): Promise<void> {
        await test.step(`Fill department form fields for: ${department.name}`, async () => {
            await this.departmentFormPage.verifyPageIsLoaded();
            await this.departmentFormPage.fillName(department.name);
            await this.departmentFormPage.selectType(department.type);
            if (department.parent) {
                await this.departmentFormPage.selectParent(department.parent);
            }
            await this.departmentFormPage.fillDescription(department.description);
        });
    }

    async verifyDepartmentDetails(department: Department): Promise<void> {
        await test.step(`Verify department details fields for: ${department.name}`, async () => {
            expect(await this.departmentDetailsPage.getName()).toBe(department.name);
            const typeText = await this.departmentDetailsPage.getType();
            expect(typeText.toLowerCase()).toContain(department.type);
            expect(await this.departmentDetailsPage.getDescription()).toBe(department.description);
        });
    }

    async verifyDepartmentTitle(expectedName: string): Promise<void> {
        await test.step(`Verify department title is: ${expectedName}`, async () => {
            expect(await this.departmentDetailsPage.getPageTitle()).toBe(expectedName);
        });
    }

    async openDepartmentDetails(name: string): Promise<void> {
        await test.step(`Open department details: ${name}`, async () => {
            await this.departmentsPage.clickDepartmentName(name);
        });
    }

    async verifyParentFieldIsDisabled(): Promise<void> {
        await test.step('Verify "Inclus în" field is disabled', async () => {
            await expect(this.departmentFormPage.getParentSelect()).toBeDisabled();
        });
    }

    async createDepartment(department: Department): Promise<void> {
        await test.step(`Create department: ${department.name}`, async () => {
            await this.departmentFormPage.verifyPageIsLoaded();
            await this.departmentFormPage.fillName(department.name);
            await this.departmentFormPage.selectType(department.type);
            if (department.parent) {
                await this.departmentFormPage.selectParent(department.parent);
            }
            await this.departmentFormPage.fillDescription(department.description);
            await this.departmentFormPage.clickSave();

            TestLogger.logUi(`Department created: ${department.name}`);
        });
    }
}
