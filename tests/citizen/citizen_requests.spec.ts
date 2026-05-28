import { application } from '@/config/apps';
import { citizen } from '@/config/users';
import { expect, test } from '@/fixtures/common.fixtures';


test.describe('Citizen Requests API', () => {

    test.beforeEach(async ({ loginService }) => {
        await loginService.loginToApplicationRequest(citizen.email, citizen.pass, application.appName);
    });

    test('can submit a citizen request', async ({ loginService, citizenRequestService }) => {
        const token = await loginService.extractBearerToken();

        const response = await citizenRequestService.submitCitizenRequest(
            {
                citizen_identification_value: '1860802437675',
                citizen_details: {
                    last_name: 'Horatiu',
                    first_name: 'Encian',
                    cif: '1860802437675',
                    phone: '0777123456',
                    email: citizen.email,
                    state: 'Bistrița-Năsăud',
                    city: 'Bistrița',
                    street: 'George Enescu',
                    number: '6E',
                    id: 280,
                    category: 'individual',
                },
                short_description: 'QA Test - Audienta 1',
                request_type_id: 357,
                form_data: { 1129: 'Camp test' },
            },
            1,
            token
        );

        await expect(response).toBeOK();
    });

});
