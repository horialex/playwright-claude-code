
import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { DepartmentFactory } from '@/factories/DepartmentFactory';
import { DepartmentModule } from '@/constants/DepartmentConstants';


test.describe('Digital Citizen: Admin - Departments(Compartimente)', () => {

    test.beforeEach(async ({ loginService }) => {
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
    });

    test('admin user can create a top-level department [Directie]', async ({ headerSteps, departmentsSteps, page }) => {
        const direction = DepartmentFactory.buildDirection();

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(direction);
        await departmentsSteps.searchForDepartment(direction.name);

        await departmentsSteps.verifyDepartmentIsListed(direction.name);
        await page.pause()
    });

    test('admin user can create a service department under a direction parent department [Directie -> Serviciu]', async ({
        departmentService,
        headerSteps,
        departmentsSteps
    }) => {

        const direction = await departmentService.createDirection();
        const serviceDepartment = DepartmentFactory.buildService(direction.name, { name: 'Ioana_Service' });

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(serviceDepartment);
        await departmentsSteps.searchForDepartment(serviceDepartment.name)

        await departmentsSteps.verifyDepartmentIsListed(serviceDepartment.name);
        await departmentsSteps.verifyDepartmentRowDetails(serviceDepartment);
    });


    test('admin user can create a department under a service [Directie -> Serviciu -> Departament]', async ({
        departmentService,
        headerSteps,
        departmentsSteps
    }) => {

        const direction = await departmentService.createDirection();
        const serviceDepartment = await departmentService.createService(direction);
        const department = DepartmentFactory.buildDepartment(serviceDepartment.name);

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(department);
        await departmentsSteps.searchForDepartment(department.name);

        await departmentsSteps.verifyDepartmentIsListed(department.name);
        await departmentsSteps.verifyDepartmentRowDetails(department);
    });

    test('admin user can create a direction department [Directie] under [Flux digital] section and verify it is not visible in [Dosar digital] or [Registratura] section', async ({
        headerSteps,
        departmentsSteps
    }) => {
        const direction = DepartmentFactory.buildDirection();

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.selectDepartmentTab(DepartmentModule.FLUX_DIGITAL);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.createDepartment(direction);
        await departmentsSteps.searchForDepartment(direction.name);
        await departmentsSteps.verifyDepartmentIsListed(direction.name);

        await departmentsSteps.selectDepartmentTab(DepartmentModule.DOSAR_DIGITAL);
        await departmentsSteps.searchForDepartment(direction.name);
        await departmentsSteps.verifyDepartmentIsNotListed(direction.name);

        await departmentsSteps.selectDepartmentTab(DepartmentModule.REGISTRATURA);
        await departmentsSteps.searchForDepartment(direction.name);
        await departmentsSteps.verifyDepartmentIsNotListed(direction.name);
    });

    test('admin user cannot select a parent when creating a top-level direction [Directie - nivel 1]', async ({
        headerSteps,
        departmentsSteps
    }) => {
        const direction = DepartmentFactory.buildDirection();

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.selectDepartmentTab(DepartmentModule.FLUX_DIGITAL);
        await departmentsSteps.clickAddDepartmentButton();
        await departmentsSteps.fillDepartmentFormFields(direction);
        await departmentsSteps.verifyParentFieldIsDisabled();
    });

    test('admin user can clear search filter and see all departments listed', async ({
        departmentService,
        headerSteps,
        departmentsSteps,
    }) => {
        const direction1 = await departmentService.createDirection();

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.searchForDepartment(direction1.name);
        await departmentsSteps.verifyDepartmentIsListed(direction1.name);
        await departmentsSteps.verifyDepartmentCount(1);
        await departmentsSteps.clickClearFilters();
        await departmentsSteps.verifyMultipleDepartmentsListed();
    });


    test.only('admin user can create a new department and open it to verify the details', async ({
        departmentService,
        headerSteps,
        departmentsSteps,
        generalSteps
    }) => {
        const direction = await departmentService.createDirection(DepartmentModule.REGISTRATURA);

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);
        await departmentsSteps.selectDepartmentTab(DepartmentModule.REGISTRATURA);
        await departmentsSteps.searchForDepartment(direction.name);
        await departmentsSteps.openDepartmentDetails(direction.name);

        await generalSteps.verifyUserIsOnPage(`/compartmentsone/${direction.id}`);
        await departmentsSteps.verifyDepartmentTitle(direction.name);
        await departmentsSteps.verifyDepartmentDetails(direction);
    });

});
