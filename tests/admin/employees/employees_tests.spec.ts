
import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { EmployeeFactory } from '@/factories/EmployeeFactory';


test.describe('Digital Citizen: Admin - Employees(Angajați)', () => {

    test.beforeEach(async ({ loginService }) => {
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
    });

    test('admin user can create an employee', async ({ headerSteps, employeesSteps }) => {
        const employee = EmployeeFactory.build();

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.EMPLOYEES);
        await employeesSteps.verifyEmployeesPageIsLoaded();
        await employeesSteps.clickAddEmployeeButton();
        await employeesSteps.createEmployee(employee);
        await employeesSteps.verifyEmployeesPageIsLoaded();
        await employeesSteps.searchForEmployee(employee.email);
        await employeesSteps.verifyEmployeeIsListed(employee.email);
        await employeesSteps.verifyEmployeeRowDetails(employee);
    });

    test('admin user can create an employee [verified via API]', async ({ headerSteps, employeesSteps, employeeService }) => {
        const employee = EmployeeFactory.build();

        console.log("Employee name: ", employee.firstName)

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.EMPLOYEES);
        await employeesSteps.verifyEmployeesPageIsLoaded();
        await employeesSteps.clickAddEmployeeButton();
        await employeesSteps.createEmployee(employee);

        await employeeService.verifyEmployeeExists(employee.email);
    });

    test('admin can create an employee via API [verified via UI and API]', async ({ headerSteps, employeesSteps, employeeService }) => {
        const employeePayload = EmployeeFactory.buildApiPayload();
        const employee = await employeeService.createEmployee(employeePayload);

        await headerSteps.selectAdminSettingsOption(AdminSettingsOption.EMPLOYEES);
        await employeesSteps.verifyEmployeesPageIsLoaded();
        await employeesSteps.searchForEmployee(employee.email);
        await employeesSteps.verifyEmployeeIsListed(employee.email);
        await employeeService.verifyEmployeeExistsById(employee.id, employee.email);
    });

});
