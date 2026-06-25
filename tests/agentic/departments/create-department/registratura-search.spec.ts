// spec: specs/create-department-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { DepartmentModule } from '@/constants/DepartmentConstants';

test.describe('Create Department in Registratură Sub-Module', () => {
    test('Verify that Registratură department is visible via Search in Registratură sub-module', async ({
        loginService,
        departmentService,
        departmentsSteps,
        page,
    }) => {
        // Prerequisite: Login as admin and create 'Dept_Registratura_Test_001' via API in the Registratură sub-module.
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
        const parentDirection = await departmentService.createDirection(DepartmentModule.REGISTRATURA);
        const parentService = await departmentService.createService(parentDirection, DepartmentModule.REGISTRATURA);
        const department = await departmentService.createDepartment(parentService, DepartmentModule.REGISTRATURA);

        // Step 1: Navigate to /compartmentsone - expect the Registratură department list page is loaded
        await departmentsSteps.navigateToDepartmentParent('REGISTRATURA');
        await departmentsSteps.verifyDepartmentsPageIsLoaded();
        await expect(page.getByRole('link', { name: 'Registratură' })).toBeVisible();

        // Step 2: Type the department name into the 'Caută' (Search) field.
        // expect: The list filters in real time. The count label updates to 'Compartimente (1)'. Only the matching row is displayed.
        const searchInput = page.getByRole('textbox', { name: 'Caută' });
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toHaveValue('');
        await departmentsSteps.searchForDepartment(department.name);
        await expect(page.getByText('Compartimente (1)')).toBeVisible();
        await departmentsSteps.verifyDepartmentIsListed(department.name);

        // Step 3: Verify the row shows the correct department name, type ('departament'), and status ('activ').
        // expect: Row data is correct: Name = department.name, Tip = 'departament', Status = 'activ'.
        await departmentsSteps.verifyDepartmentRowDetails(department);

        // Step 4: Click 'Șterge filtrele' to clear the search.
        // expect: The search is cleared and the full Registratură department list is restored.
        await departmentsSteps.clickClearFilters();
        await expect(searchInput).toHaveValue('');
        await departmentsSteps.verifyMultipleDepartmentsListed();
    });
});
