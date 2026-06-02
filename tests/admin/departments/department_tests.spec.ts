
import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { DepartmentFactory } from '@/factories/DepartmentFactory';
import { DepartmentParent } from '@/constants/DepartmentConstants';


test.describe('Digital Citizen: Admin - Departments(Compartimente)', () => {

    test.beforeEach(async ({ loginSteps, loginService }) => {
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
        await loginSteps.verifyUserIsOnApplicationPage(admin.emailPrefix);
    });

    test('admin user can create a top-level department [Directie]', async ({ headerSteps, departmentsSteps }) => {
        const direction = DepartmentFactory.buildDirection();

        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(direction);
        await departmentsSteps.searchForDepartment(direction.name);

        await departmentsSteps.verifyDepartmentIsListed(direction.name);
    });

    test('admin user can create a service under a direction [Directie -> Serviciu]', async ({
        departmentService,
        headerSteps,
        departmentsSteps
    }) => {

        const direction = await departmentService.createDirection();

        const serviceDepartment = DepartmentFactory.buildService(direction.name);
        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(serviceDepartment);
        await departmentsSteps.searchForDepartment(serviceDepartment.name)

        await departmentsSteps.verifyDepartmentIsListed(serviceDepartment.name);
    });

    test.only('admin user can create a direction department [Directie] under [Flux digital] section and verify it is not visible in [Dosar digital] section', async ({
        headerSteps,
        departmentsSteps
    }) => {
        const direction = DepartmentFactory.buildDirection();

        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.selectDepartmentParent(DepartmentParent.FLUX_DIGITAL);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(direction);
        await departmentsSteps.searchForDepartment(direction.name);
        await departmentsSteps.verifyDepartmentIsListed(direction.name);

        await departmentsSteps.selectDepartmentParent(DepartmentParent.DOSAR_DIGITAL);
        await departmentsSteps.searchForDepartment(direction.name);
        await departmentsSteps.verifyDepartmentIsNotListed(direction.name);
    });

    test('admin user can create a department under a service [Directie -> Serviciu -> Departament]', async ({
        departmentService,
        headerSteps,
        departmentsSteps
    }) => {

        const direction = await departmentService.createDirection();
        const serviceDepartment = await departmentService.createService(direction);

        const department = DepartmentFactory.buildDepartment(serviceDepartment.name);
        await headerSteps.openAdminSettings(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(department);
        await departmentsSteps.searchForDepartment(department.name);
        await departmentsSteps.verifyDepartmentIsListed(department.name);
    });

});
