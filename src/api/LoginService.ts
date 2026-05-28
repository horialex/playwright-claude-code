import test, { expect, Page } from "@playwright/test";
import { ApiHelper } from "./ApiHelper";
import { extractCsrfToken, getAppLink } from "../utils/HtmlHelper";
import { Routes } from "../routes/routes";

export class LoginService {
    private readonly page: Page;
    private readonly api: ApiHelper;

    constructor(page: Page) {
        this.page = page;

        // We use page.request so the API calls are connected to the same browser context.
        this.api = new ApiHelper(page.request);
    }

    async loginDigitalCitizenApiRequest(email: string, password: string): Promise<void> {
        await test.step(`Login to Digital Citizen via API request`, async () => {
            const loginUrl = `${process.env.FIWMARE_URL}${Routes.LOGIN}`;
            const csrfToken = await extractCsrfToken(this.page, loginUrl);

            const response = await this.api.request
                .path(loginUrl)
                .form({
                    _csrf: csrfToken,
                    email,
                    password,
                })
                .post();

            await expect(response).toBeOK();
        });
    }

    async openApplicationApiRequest(appName: string, email: string): Promise<void> {
        await test.step(`Open application ${appName} via API request`, async () => {
            const redirectLink = await getAppLink(appName, this.page);
            const csrfToken = await extractCsrfToken(this.page, redirectLink);

            const response = await this.api.request
                .path(redirectLink)
                .form({
                    _csrf: csrfToken,
                    email,
                })
                .post();

            await expect(response).toBeOK();
            const citizenUrl = response.url();
            await this.page.goto(citizenUrl);
        });
    }

    async loginToApplicationRequest(
        email: string,
        password: string,
        appName: string
    ): Promise<void> {
        await test.step(`Login to application via API request`, async () => {
            await this.loginDigitalCitizenApiRequest(email, password);
            await this.openApplicationApiRequest(appName, email);
        });
    }

    async extractBearerToken(): Promise<string> {
        const raw = await this.page.evaluate(() => localStorage.getItem('TOKEN'));
        if (!raw) {
            throw new Error('Bearer token not found in localStorage. Make sure the user is logged in to the application.');
        }
        return JSON.parse(raw);
    }

}
