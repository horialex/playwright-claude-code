import { test } from '@/fixtures/common.fixtures';

import { application } from '@/config/apps';
import { AdminSettingsOption } from '@/constants/HeaderConstants';
import { admin } from '@/config/users';


test.describe('Test group', () => {
  test('seed', async ({ page, loginService, headerSteps }) => {
    // generate code here.
    await loginService.loginToApplicationRequest(admin.email, admin.pass, application.appName);
    await headerSteps.selectAdminSettingsOption(AdminSettingsOption.DEPARTMENTS);
  });
});
