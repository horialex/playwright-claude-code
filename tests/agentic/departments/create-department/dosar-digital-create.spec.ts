// spec: tests/create-department/dosar-digital-create.spec.ts
// seed: tests/seed.spec.ts

import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { DepartmentModule } from '@/constants/DepartmentConstants';
import { DepartmentFactory } from '@/factories/DepartmentFactory';
import { DepartmentType } from '@/model/Department';

test.describe('Create Department in Dosar Digital Sub-Module', () => {
  test.beforeEach(async ({ loginService }) => {
    await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
  });

  test('Successfully create a department in the Dosar Digital sub-module', async ({
    headerSteps,
    departmentsSteps,
  }) => {
    const department = DepartmentFactory.build({
      type: DepartmentType.DIRECTIE,
      description: 'Test department for Dosar Digital module',
    });

    // 1. Log in as admin and open the admin settings panel by clicking 'Deschideți setările de administrator'
    await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);

    // 2. Click the 'Compartimente' menu item in the admin settings panel
    // 3. Click the 'Dosar digital' tab link — navigates to /compartmentsdoc
    await departmentsSteps.verifyDepartmentsPageIsLoaded();
    await departmentsSteps.selectDepartmentTab(DepartmentModule.DOSAR_DIGITAL);

    // 4. Click the 'Adaugă compartiment' button
    await departmentsSteps.clickAddDepartmentButton();

    // 5–7. Fill in the department form: name 'Dept_DosarDigital_Test_001', type 'Serviciu (nivel 2)', description, then click Salvează
    await departmentsSteps.createDepartment(department);

    // 8. Verify the application navigates back to /compartmentsdoc and the newly created department appears in the list
    await departmentsSteps.searchForDepartment(department.name);
    await departmentsSteps.verifyDepartmentIsListed(department.name);
  });
});
