import { test } from '@/fixtures/common.fixtures';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { application } from '@/config/apps';
import { admin, citizen } from '@/config/users';
import { UserCredentials } from '@/model/User';
import { DigitalCitizenPage } from '@/pages/DigitalCitizenPage';

export class LoginSteps {
    private loginPage: LoginPage;
    private digitalCitizenPage: DigitalCitizenPage;
    private homePage: HomePage;

    constructor(loginPage: LoginPage, digitalCitizenPage: DigitalCitizenPage, homePage: HomePage) {
        this.loginPage = loginPage;
        this.digitalCitizenPage = digitalCitizenPage;
        this.homePage = homePage;
    }

    async openLoginPage(): Promise<void> {
        await test.step('Open login page', async () => {
            await this.loginPage.goto();
        });
    }

    async loginToPlatform(email: string, pass: string): Promise<void> {
        await test.step('Login to platform', async () => {
            await this.loginPage.login(email, pass);
        });
    }

    async verifyUserIsGreeted(userName: string): Promise<void> {
        await test.step(`Verify user is greeted as ${userName}`, async () => {
            await this.digitalCitizenPage.verifyUserIsGreeted(userName);
        });
    }

    async selectApplication(appName: string = application.appName): Promise<void> {
        await test.step(`Select application: ${appName}`, async () => {
            await this.digitalCitizenPage.selectApplicationSelfTab(appName);
        });
    }

    async confirmLogin(): Promise<void> {
        await test.step('Confirm login', async () => {
            await this.loginPage.confirmLogin();
        });
    }

    async verifyUserIsOnApplicationPage(emailPrefix: string): Promise<void> {
        await test.step('Verify user is on the application page', async () => {
            await this.homePage.verifyUserIsOnHomePage(emailPrefix);
        });
    }

    async loginAndAccessApp(email: string, pass: string, appName: string, emailPrefix: string): Promise<void> {
        await test.step('Login and access application', async () => {
            await this.loginPage.goto();
            await this.loginPage.login(email, pass);
            await this.digitalCitizenPage.selectApplicationSelfTab(appName);
            await this.loginPage.confirmLogin();
            await this.homePage.verifyUserIsOnHomePage(emailPrefix);
        });
    }

    async loginToApplicationAsAdmin(user: UserCredentials = admin): Promise<void> {
        await test.step('Login as Admin and access application', async () => {
            await this.loginAndAccessApp(user.email, user.pass, application.appName, user.emailPrefix);
        });
    }

    async loginToApplicationAsCitizen(user: UserCredentials = citizen): Promise<void> {
        await test.step('Login as Citizen and access application', async () => {
            await this.loginAndAccessApp(user.email, user.pass, application.appName, user.emailPrefix);
        });
    }
}
