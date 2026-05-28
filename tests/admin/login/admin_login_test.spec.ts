
import { test } from '@/fixtures/common.fixtures';
import { admin } from '@/config/users';
import { application } from '@/config/apps';

test.describe('Digital Citizen: Admin - Login', () => {

    test('admin user can login to Digital Citizen platform', async ({ loginSteps }) => {
        await loginSteps.openLoginPage();
        await loginSteps.loginToPlatform(admin.email, admin.pass);
        await loginSteps.verifyUserIsGreeted(admin.username);
    });

    test('admin user can access digital citizen application', async ({ loginSteps }) => {
        await loginSteps.openLoginPage();
        await loginSteps.loginToPlatform(admin.email, admin.pass);
        await loginSteps.selectApplication(application.appName);
        await loginSteps.confirmLogin();
        await loginSteps.verifyUserIsOnApplicationPage(admin.emailPrefix);
    });

    test('admin user can access digital citizen application via api login', async ({ loginSteps, loginService }) => {
        await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
        await loginSteps.verifyUserIsOnApplicationPage(admin.emailPrefix);
    });
});
