import { test as pageTest } from './page.fixtures';
import { LoginSteps } from '@/steps/ui/LoginSteps';
import { CitizenRequestsSteps } from '@/steps/ui/CitizenRequestsSteps';
import { GeneralSteps } from '@/steps/ui/GeneralSteps';
import { HeaderSteps } from '@/steps/ui/HeaderSteps';
import { DepartmentsSteps } from '@/steps/ui/DepartmentsSteps';

type StepFixtures = {
    loginSteps: LoginSteps;
    citizenRequestsSteps: CitizenRequestsSteps;
    generalSteps: GeneralSteps;
    headerSteps: HeaderSteps;
    departmentsSteps: DepartmentsSteps;
};

export const test = pageTest.extend<StepFixtures>({
    loginSteps: async ({ loginPage, digitalCitizenPage, homePage }, use) => {
        await use(new LoginSteps(loginPage, digitalCitizenPage, homePage));
    },

    citizenRequestsSteps: async ({ citizenRequestsPage }, use) => {
        await use(new CitizenRequestsSteps(citizenRequestsPage));
    },

    generalSteps: async ({ page }, use) => {
        await use(new GeneralSteps(page));
    },

    headerSteps: async ({ headerPage }, use) => {
        await use(new HeaderSteps(headerPage));
    },

    departmentsSteps: async ({ departmentsPage, departmentFormPage }, use) => {
        await use(new DepartmentsSteps(departmentsPage, departmentFormPage));
    },
});
