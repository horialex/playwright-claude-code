import { expect, Locator, Page } from "@playwright/test";

export class BasePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async refreshPage() {
        await this.page.reload();
    }

    async dismissCookies() {
        await this.page.getByRole('button', { name: 'dismiss cookie message' }).click();
    }

    async removeLocatorAttribute(myLocator: Locator, attribute: string) {
        await myLocator.evaluate((el, attr) => el.removeAttribute(attr), attribute);
    }

    async verifyTextIsDisplayed(expectedMessage: string): Promise<void> {
        await expect(async () => {
            await expect(
                this.page.getByText(expectedMessage, { exact: false }).last()
            ).toBeVisible();
        }).toPass({ timeout: 5000 });
    }

    async verifyUserIsOnPage(url: string | RegExp): Promise<void> {
        await expect(this.page).toHaveURL(url);
    }

    async waitForListToFullyLoad(listLocator: Locator) {
        await expect(async () => {
            await expect(listLocator.last()).toBeVisible();
        }).toPass();
    }

    async expectElementToBeDisabled(element: Locator) {
        await expect(async () => {
            await expect(element).toBeDisabled();
        }).toPass()
    }

    async expectElementToBeDisplayed(element: Locator) {
        await expect(async () => {
            await expect(element).toBeVisible();
        }).toPass()
    }

    async expectElementNotToBeDisplayed(element: Locator) {
        await expect(async () => {
            await expect(element).not.toBeVisible();
        }).toPass()
    }

    async dragAndDrop(draggable: Locator, droppable: Locator) {
        const dragBox = await draggable.boundingBox();
        const dropBox = await droppable.boundingBox();

        if (!dragBox || !dropBox) {
            throw new Error("Could not get element bounding boxes");
        }

        await draggable.hover();
        await this.page.mouse.down();
        await this.page.waitForTimeout(100);
        const dropX = Math.round(dropBox.x + dropBox.width / 2);
        const dropY = Math.round(dropBox.y + dropBox.height / 2);
        await droppable.scrollIntoViewIfNeeded();
        await this.page.mouse.move(dropX, dropY, { steps: 5 });
        await this.page.mouse.up();
        await this.page.waitForTimeout(200);
    }

    async isElementClickable(locator: Locator): Promise<boolean> {
        try {
            await locator.click({ trial: true, timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }

    async isMobileViewport(): Promise<boolean> {
        const viewport = this.page.viewportSize();
        return viewport !== null && viewport.width < 768;
    }

    async clickOnListElement(list: Locator, textToMatch: string) {
        const item = list.filter({ hasText: textToMatch });
        await expect(item.first()).toBeVisible();
        await item.first().click();
    }

}
