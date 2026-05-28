
import { test } from '@/fixtures/common.fixtures';
import { citizen } from '@/config/users';


test.describe('Login Digital Citizen', () => {
    test('can login as Citizen to Digital Citizen platform', async ({ loginSteps }) => {
        await loginSteps.openLoginPage()
        await loginSteps.loginToPlatform(citizen.email, citizen.pass)
        await loginSteps.verifyUserIsGreeted(citizen.username);
    });
});


test.describe('Digital Citizen Platform', () => {
    test.beforeEach(async ({ loginSteps }) => {
        await loginSteps.openLoginPage();
        await loginSteps.loginToPlatform(citizen.email, citizen.pass);
    });


    test('can access digital citizen application', async ({ loginSteps, page }) => {
        await loginSteps.selectApplication();
        await loginSteps.confirmLogin();
        await loginSteps.verifyUserIsOnApplicationPage(citizen.emailPrefix);
    });

});
