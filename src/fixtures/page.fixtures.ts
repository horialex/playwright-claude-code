import { HomePage } from '@/pages/HomePage';
import { HeaderPage } from '@/pages/HeaderPage';
import { DepartmentsPage } from '@/pages/admin/DepartmentsPage';
import { DepartmentFormPage } from '@/pages/admin/DepartmentFormPage';
import { DepartmentDetailsPage } from '@/pages/admin/DepartmentDetailsPage';
import { apiTest } from './api.fixtures';
import { DigitalCitizenPage } from '@/pages/admin/DigitalCitizenPage';
import { PersonalInformationPage } from '@/pages/PersonalInformationPage';
import { CitizenRequestsPage } from '@/pages/CitizenRequestsPage';
import { LoginPage } from '@/pages/LoginPage';
import { EmployeesPage } from '@/pages/admin/EmployeesPage';
import { AddEmployeeFormPage } from '@/pages/admin/AddEmployeeFormPage';


type PageFixtures = {
    loginPage: LoginPage;
    digitalCitizenPage: DigitalCitizenPage;
    homePage: HomePage;
    personalInformationPage: PersonalInformationPage;
    citizenRequestsPage: CitizenRequestsPage;
    headerPage: HeaderPage;
    departmentsPage: DepartmentsPage;
    departmentFormPage: DepartmentFormPage;
    departmentDetailsPage: DepartmentDetailsPage;
    employeesPage: EmployeesPage;
    addEmployeeFormPage: AddEmployeeFormPage;
};

export const test = apiTest.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    digitalCitizenPage: async ({ page }, use) => {
        const digitalCitizenPage = new DigitalCitizenPage(page);
        await use(digitalCitizenPage);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    personalInformationPage: async ({ page }, use) => {
        const personalInformationPage = new PersonalInformationPage(page);
        await use(personalInformationPage);
    },

    citizenRequestsPage: async ({ page }, use) => {
        const citizenRequestsPage = new CitizenRequestsPage(page);
        await use(citizenRequestsPage);
    },

    headerPage: async ({ page }, use) => {
        await use(new HeaderPage(page));
    },

    departmentsPage: async ({ page }, use) => {
        await use(new DepartmentsPage(page));
    },

    departmentFormPage: async ({ page }, use) => {
        await use(new DepartmentFormPage(page));
    },

    departmentDetailsPage: async ({ page }, use) => {
        await use(new DepartmentDetailsPage(page));
    },

    employeesPage: async ({ page }, use) => {
        await use(new EmployeesPage(page));
    },

    addEmployeeFormPage: async ({ page }, use) => {
        await use(new AddEmployeeFormPage(page));
    },

});
