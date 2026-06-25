// spec: specs/create-department-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { DepartmentModule } from '@/constants/DepartmentConstants';

test.describe('Create Department in Flux Digital Sub-Module', () => {
    test('Verify that Flux Digital department is visible via Search in Flux Digital sub-module', async ({
        loginService,
        departmentService,
        departmentsSteps,
        page,
    }) => {
        // Prerequisite: Login as admin and create 'Dept_FluxDigital_Test_001' via API in the Flux Digital sub-module.
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
        const department = await departmentService.createDirection(DepartmentModule.FLUX_DIGITAL);

        // Step 1: Navigate to /compartmentsreg - expect the Flux digital department list page is loaded
        await departmentsSteps.navigateToDepartmentParent('FLUX_DIGITAL');
        await departmentsSteps.verifyDepartmentsPageIsLoaded();
        await expect(page.getByRole('link', { name: 'Flux digital' })).toBeVisible();

        // Step 2: Locate the 'Caută' (Search) text input field in the Filtre (Filters) panel.
        // expect: The search text box is visible and empty.
        const searchInput = page.getByRole('textbox', { name: 'Caută' });
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toHaveValue('');

        // Step 3: Type the department name into the search field.
        // expect: The department list filters in real time. The count label updates to 'Compartimente (1)'. Only the matching row is displayed.
        await departmentsSteps.searchForDepartment(department.name);
        await expect(page.getByText('Compartimente (1)')).toBeVisible();
        await departmentsSteps.verifyDepartmentIsListed(department.name);

        // Step 4: Verify the displayed row shows the correct department name, type ('direcție'), and status ('activ').
        // expect: The row contains: Name = department.name, Tip = 'direcție', Status = 'activ'.
        await departmentsSteps.verifyDepartmentRowDetails(department);

        // Step 5: Clear the search field by clicking the 'Șterge filtrele' (Clear filters) button.
        // expect: The search field is cleared. The full department list is restored with the original count.
        await departmentsSteps.clickClearFilters();
        await expect(searchInput).toHaveValue('');
        await departmentsSteps.verifyMultipleDepartmentsListed();
    });
});
