import { application } from "@/config/apps";
import { citizen } from "@/config/users";
import { test } from "@/fixtures/common.fixtures";


test.describe('Digital Citizen Platform API tests', () => {

  test.only('login to digital citizen via API request', async ({ loginService, digitalCitizenPage, }) => {
    await loginService.loginDigitalCitizenApiRequest(citizen.email, citizen.pass);
    await digitalCitizenPage.goto();
    await digitalCitizenPage.verifyUserIsGreeted(citizen.username);

  });

  test('login and open application via API request', async ({ loginService, homePage, page }) => {
    await loginService.loginToApplicationRequest(citizen.email, citizen.pass, application.appName);
    await homePage.verifyUserIsOnHomePage(citizen.emailPrefix);
    await page.pause()
  });

});
