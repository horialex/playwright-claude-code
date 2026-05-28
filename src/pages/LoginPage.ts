import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    private emailInput: Locator;
    private passInput: Locator;
    private loginBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.getByRole('textbox', { name: 'Email *' });
        this.passInput = page.getByRole('textbox', { name: 'Parolă *' });
        this.loginBtn = page.locator("button[class='btn btn-primary']");
    }

    async goto() {
        await this.page.goto('/');
        await this.dismissCookies();
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async fillPassword(pass: string): Promise<void> {
        await this.passInput.fill(pass);
    }

    async clickLogin(): Promise<void> {
        await this.loginBtn.click();
    }

    async login(email: string, pass: string): Promise<void> {
        await this.fillEmail(email);
        await this.fillPassword(pass);
        await this.clickLogin();
    }

    async confirmLogin(): Promise<void> {
        await Promise.all([
            this.page.locator("//div[@id='container']//span[1]").click(),
            this.page.waitForURL(/\/(citizen|home)/),
        ]);
    }

}
