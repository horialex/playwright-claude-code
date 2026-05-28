import { expect, test } from '@/fixtures/common.fixtures';
import { RequestStatus } from '@/constants/DigitalCitizenConstants';
import { citizen } from '@/config/users';
import { application } from '@/config/apps';


test.describe('Citizen Requests - Filters', () => {

    test.beforeEach(async ({ loginService, citizenRequestsPage, page }) => {
        await loginService.loginToApplicationRequest(citizen.email, citizen.pass, application.appName);

        await citizenRequestsPage.goto();
        await citizenRequestsPage.verifyPageIsLoaded();
    });

    test('filter by status narrows results and clear resets them', async ({ citizenRequestsPage, page }) => {
        const totalCount = await citizenRequestsPage.getRecordsCount();
        await citizenRequestsPage.filterByStatus(RequestStatus.SUBMITTED);
        expect(await citizenRequestsPage.getRecordsCount()).toBeLessThan(totalCount);
        await citizenRequestsPage.clearFilters();
        expect(await citizenRequestsPage.getRecordsCount()).toBe(totalCount);
    });

});
