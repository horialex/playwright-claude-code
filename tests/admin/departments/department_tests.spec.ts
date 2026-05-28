
import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { DepartmentFactory } from '@/factories/DepartmentFactory';

test.describe('Digital Citizen: Admin - Departments(Compartimente)', () => {

    test.beforeEach(async ({ loginSteps, loginService }) => {
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
        await loginSteps.verifyUserIsOnApplicationPage(admin.emailPrefix);

    });

    test.only('admin user can create a department -> "Directie"', async ({ headerSteps, departmentsSteps }) => {
        const department = DepartmentFactory.buildDirectie();

        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.verifyDepartmentsPageIsLoaded();
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(department);
        await departmentsSteps.verifyDepartmentIsListed(department.name);
    });

});
