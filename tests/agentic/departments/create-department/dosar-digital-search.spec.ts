// spec: specs/create-department-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { DepartmentModule } from '@/constants/DepartmentConstants';

test.describe('Create Department in Dosar Digital Sub-Module', () => {
    test('Verify that Dosar Digital department is visible via Search in Dosar Digital sub-module', async ({
        loginService,
        departmentService,
        departmentsSteps,
        page,
    }) => {
        // Prerequisite: Login as admin and create Department via API in the Dosar Digital sub-module.
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
        const parentDirection = await departmentService.createDirection(DepartmentModule.DOSAR_DIGITAL);
        // const department = await departmentService.createService(parentDirection, DepartmentModule.DOSAR_DIGITAL);

        // Step 1: Navigate to /compartmentsdoc - expect the Dosar digital department list page is loaded
        await departmentsSteps.navigateToDepartmentParent('DOSAR_DIGITAL');
        await departmentsSteps.verifyDepartmentsPageIsLoaded();
        await expect(page.getByRole('link', { name: 'Dosar digital' })).toBeVisible();

        // Step 2: Type the department name into the 'Caută' (Search) field.
        // expect: The list filters in real time. The count label updates to 'Compartimente (1)'. Only the matching row is displayed.
        const searchInput = page.getByRole('textbox', { name: 'Caută' });
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toHaveValue('');
        await departmentsSteps.searchForDepartment(parentDirection.name);
        await expect(page.getByText('Compartimente (1)')).toBeVisible();
        await departmentsSteps.verifyDepartmentIsListed(parentDirection.name);

        // Step 3: Verify the row shows the correct department name, type ('serviciu'), and status ('activ').
        // expect: Row data is correct: Name = department.name, Tip = 'serviciu', Status = 'activ'.
        await departmentsSteps.verifyDepartmentRowDetails(parentDirection);

        // Step 4: Click 'Șterge filtrele' to clear the search.
        // expect: The search is cleared and the full Dosar digital department list is restored.
        await departmentsSteps.clickClearFilters();
        await expect(searchInput).toHaveValue('');
        await departmentsSteps.verifyMultipleDepartmentsListed();
    });
});
