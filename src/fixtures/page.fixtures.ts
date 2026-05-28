import { HomePage } from '@/pages/HomePage';
import { HeaderPage } from '@/pages/HeaderPage';
import { DepartmentsPage } from '@/pages/DepartmentsPage';
import { DepartmentFormPage } from '@/pages/DepartmentFormPage';
import { apiTest } from './api.fixtures';
import { DigitalCitizenPage } from '@/pages/DigitalCitizenPage';
import { PersonalInformationPage } from '@/pages/PersonalInformationPage';
import { CitizenRequestsPage } from '@/pages/CitizenRequestsPage';
import { LoginPage } from '@/pages/LoginPage';


type PageFixtures = {
    loginPage: LoginPage;
    digitalCitizenPage: DigitalCitizenPage;
    homePage: HomePage;
    personalInformationPage: PersonalInformationPage;
    citizenRequestsPage: CitizenRequestsPage;
    headerPage: HeaderPage;
    departmentsPage: DepartmentsPage;
    departmentFormPage: DepartmentFormPage;
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
});
