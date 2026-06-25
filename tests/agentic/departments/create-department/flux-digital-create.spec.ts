// spec: specs/create-department-test-plan.md
// seed: tests/seed.spec.ts

import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { DepartmentModule } from '@/constants/DepartmentConstants';
import { DepartmentFactory } from '@/factories/DepartmentFactory';
import { DepartmentType } from '@/model/Department';

test.describe('Create Department in Flux Digital Sub-Module', () => {
  test.beforeEach(async ({ loginService }) => {
    await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
  });

  test('Successfully create a department in the Flux Digital sub-module', async ({
    headerSteps,
    departmentsSteps,
  }) => {
    const department = DepartmentFactory.build({
      type: DepartmentType.DIRECTIE,
      description: 'Test department for Flux Digital module',
    });

    // 1. Log in as admin and open the admin settings panel by clicking the 'Deschideți setările de administrator' button
    await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);

    // 2. Click the 'Compartimente' menu item — navigates to /compartmentsreg (Flux digital tab by default)
    // 3. Verify the 'Flux digital' tab is active and the department list is displayed with a count label
    await departmentsSteps.verifyDepartmentsPageIsLoaded();
    await departmentsSteps.selectDepartmentTab(DepartmentModule.FLUX_DIGITAL);

    // 4. Click the 'Adaugă compartiment' button at the top right of the page
    await departmentsSteps.clickAddDepartmentButton();

    // 5–7. Fill in the department form: name, type, and description, then click Salvează
    await departmentsSteps.createDepartment(department);

    // 8. Verify the application navigates back to the Flux digital department list at /compartmentsreg
    // 9. Verify the newly created department appears in the department list
    await departmentsSteps.searchForDepartment(department.name);
    await departmentsSteps.verifyDepartmentIsListed(department.name);
  });
});
