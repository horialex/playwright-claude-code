
import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { DepartmentFactory } from '@/factories/DepartmentFactory';
import { CreateDepartmentPayload } from '@/model/Department';

test.describe('Digital Citizen: Admin - Departments(Compartimente)', () => {

    test.beforeEach(async ({ loginSteps, loginService }) => {
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
        await loginSteps.verifyUserIsOnApplicationPage(admin.emailPrefix);
    });

    test('admin user can create a department: Direction -> "Directie"', async ({ headerSteps, departmentsSteps }) => {
        const direction = DepartmentFactory.buildDirectie();

        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(direction);
        await departmentsSteps.verifyDepartmentIsListed(direction.name);
    });

    test.only('admin user can create a sub department: Service -> "Serviciu"', async ({
        departmentService,
        headerSteps,
        departmentsSteps,
        page
    }) => {

        const direction = DepartmentFactory.buildDirectie();
        const directiePayload: CreateDepartmentPayload = {
            name: direction.name,
            type: "direction",
            description: direction.description,
            unit_id: application.unitId,
            status: 1,
        };

        // TODO: Extract the response as json and hidrate the deparmtnet object with the id
        await departmentService.createDepartment(directiePayload);
        const serviciu = DepartmentFactory.buildServiciu(direction.name);
        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(serviciu);
        await departmentsSteps.verifyDepartmentIsListed(serviciu.name);
    });

});
