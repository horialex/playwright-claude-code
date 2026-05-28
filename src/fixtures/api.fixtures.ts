import { ApiHelper } from '@/api/ApiHelper';
import { baseTest } from './base.fixtures';
import { LoginService } from '@/api/LoginService';
import { CitizenRequestService } from '@/api/CitizenRequestService';


type ApiFixtures = {
    api: ApiHelper;
    loginService: LoginService;
    citizenRequestService: CitizenRequestService;
};

export const apiTest = baseTest.extend<ApiFixtures>({
    api: async ({ request }, use) => {
        const api = new ApiHelper(request);
        await use(api);
    },

    loginService: async ({ page }, use) => {
        const loginService = new LoginService(page);
        await use(loginService);
    },

    citizenRequestService: async ({ request }, use) => {
        const citizenRequestService = new CitizenRequestService(request);
        await use(citizenRequestService);
    },
});
