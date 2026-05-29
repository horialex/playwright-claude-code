
import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { DepartmentFactory } from '@/factories/DepartmentFactory';
import { Department } from '@/model/Department';

test.describe('Digital Citizen: Admin - Departments(Compartimente)', () => {

    test.beforeEach(async ({ loginSteps, loginService }) => {
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
        await loginSteps.verifyUserIsOnApplicationPage(admin.emailPrefix);
    });

    test('admin user can create a department: Direction -> "Directie"', async ({ headerSteps, departmentsSteps }) => {
        const direction = DepartmentFactory.buildDirection();

        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(direction);
        await departmentsSteps.verifyDepartmentIsListed(direction.name);
    });

    test.only('admin user can create a sub department: Service -> "Serviciu"', async ({
        departmentService,
        headerSteps,
        departmentsSteps
    }) => {

        const directionData = DepartmentFactory.buildDirection();
        const direction: Department = await departmentService.createDepartment(
            directionData,
            DepartmentFactory.toPayload(directionData, application.unitId)
        );

        const service = DepartmentFactory.buildService(direction.name);
        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(service);
        await departmentsSteps.searchForDepartment(service.name)

        await departmentsSteps.verifyDepartmentIsListed(service.name);
    });

});
