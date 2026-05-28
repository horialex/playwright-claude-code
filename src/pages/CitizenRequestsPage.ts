import { expect, Locator, Page } from "@playwright/test";
import { DigitalCitizenPages } from "@/routes/routes";
import { RequestStatus } from "@/constants/DigitalCitizenConstants";
import { BasePage } from "./BasePage";

export class CitizenRequestsPage extends BasePage {
    private readonly pageHeading: Locator;
    private readonly addRecordButton: Locator;
    private readonly clearFiltersButton: Locator;
    private readonly searchInput: Locator;
    private readonly recordsTable: Locator;
    private readonly recordsCountLabel: Locator;
    private readonly paginationNext: Locator;
    private readonly paginationPrev: Locator;

    // Scoped to main to exclude the language combobox in the header
    private readonly templateNameFilter: Locator;
    private readonly statusFilter: Locator;

    constructor(page: Page) {
        super(page);
        const main = page.getByRole('main');

        this.pageHeading = page.getByRole('heading', { name: 'Înregistrările mele' });
        this.addRecordButton = page.getByRole('button', { name: 'Adaugă Înregistrare' });
        this.clearFiltersButton = page.getByRole('button', { name: 'Șterge filtrele' });
        this.searchInput = main.getByRole('textbox', { name: 'Caută' });
        this.recordsTable = page.getByRole('table');
        this.recordsCountLabel = main.locator('p').filter({ hasText: /Înregistrări \(\d+\)/ }).first();
        this.paginationNext = page.getByRole('button', { name: 'Următor' }).first();
        this.paginationPrev = page.getByRole('button', { name: 'Anterior' }).first();
        this.templateNameFilter = main.getByRole('combobox').nth(0);
        this.statusFilter = main.getByRole('combobox').nth(1);
    }

    async goto(): Promise<void> {
        await this.page.goto(DigitalCitizenPages.CITIZEN);
    }

    async verifyPageIsLoaded(): Promise<void> {
        await expect(this.pageHeading).toBeVisible();
        await expect(this.recordsTable).toBeVisible();
    }

    async filterByTemplateName(name: string): Promise<void> {
        await this.templateNameFilter.click();
        await this.page.getByRole('option', { name, exact: true }).click();
    }

    async filterByStatus(status: RequestStatus): Promise<void> {
        await this.statusFilter.click();
        await this.page.locator(`[data-value="${status}"]`).click();
        await this.page.waitForLoadState('networkidle');
    }

    async search(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
    }

    async clearFilters(): Promise<void> {
        await this.clearFiltersButton.click();
    }

    async getRecordsCount(): Promise<number> {
        const label = this.page
            .getByRole('main')
            .locator('p')
            .filter({ hasText: /Înregistrări\s*\(\s*\d+\s*\)/ })
            .first();

        await expect(label).toBeVisible({ timeout: 1000 });

        const text = await label.textContent({ timeout: 1000 });
        console.log('Records count text:', JSON.stringify(text));

        const match = text?.match(/\((\d+)\)/);

        if (!match) {
            throw new Error(`Could not extract records count from: ${JSON.stringify(text)}`);
        }

        return Number(match[1]);
    }

    async clickAddRecord(): Promise<void> {
        await this.addRecordButton.click();
    }

    async clickRecordByIndex(index: number): Promise<void> {
        await this.recordsTable.getByRole('row').nth(index + 1).click(); // +1 to skip header row
    }

    async goToPage(pageNumber: number): Promise<void> {
        await this.page.getByRole('button', { name: String(pageNumber) }).first().click();
    }

    async goToNextPage(): Promise<void> {
        await this.paginationNext.click();
    }

    async goToPreviousPage(): Promise<void> {
        await this.paginationPrev.click();
    }

}
