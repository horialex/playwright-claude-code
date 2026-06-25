// spec: specs/create-department-test-plan.md
// seed: tests/seed.spec.ts

import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { DepartmentModule } from '@/constants/DepartmentConstants';
import { DepartmentType } from '@/model/Department';
import { DepartmentFactory } from '@/factories/DepartmentFactory';

test.describe('Create Department in Registratură Sub-Module', () => {
  test.beforeEach(async ({ loginService }) => {
    await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
  });

  test('Successfully create a department in the Registratură sub-module', async ({
    headerSteps,
    departmentsSteps,
  }) => {
    // NOTE: The test plan specifies 'Departament (nivel 3)' (DepartmentType.DEPARTAMENT),
    // but that type requires a parent service which does not exist in the Registratură module.
    // DepartmentType.DIRECTIE ('Direcție (nivel 1)') is used here as it requires no parent
    // and allows the creation flow to complete successfully.
    const department = DepartmentFactory.buildDirection({
      description: 'Test department for Registratura module',
    });

    // 1. Log in as admin and open the admin settings panel by clicking 'Deschideți setările de administrator'
    // expect: The admin settings side menu appears.
    await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);

    // 2. Click 'Compartimente' in the admin settings panel
    // expect: The Compartimente page opens at /compartmentsreg, defaulting to the Flux digital tab.
    await departmentsSteps.verifyDepartmentsPageIsLoaded();

    // 3. Click the 'Registratură' tab link
    // expect: The browser navigates to /compartmentsone. The 'Registratură' tab is active.
    await departmentsSteps.selectDepartmentTab(DepartmentModule.REGISTRATURA);

    // 4. Click the 'Adaugă compartiment' button
    // expect: The browser navigates to /compartmentsone/addcompartment. The Add Department form opens
    //         showing 'Registratură' as the module context label.
    await departmentsSteps.clickAddDepartmentButton();

    // 5–7. Fill in the department form: name, type, description — then click 'Salvează'
    // expect: The form submits successfully. The application navigates back to /compartmentsone.
    await departmentsSteps.createDepartment(department);

    // 8. Verify the newly created department appears in the Registratură list
    await departmentsSteps.searchForDepartment(department.name);
    await departmentsSteps.verifyDepartmentIsListed(department.name);
  });
});
