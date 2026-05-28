import { CitizenRequestsPage } from '@/pages/digial_citizen/CitizenRequestsPage';
import { RequestStatus } from '@/constants/DigitalCitizenConstants';

export class CitizenRequestsSteps {
    private citizenRequestsPage: CitizenRequestsPage;

    constructor(citizenRequestsPage: CitizenRequestsPage) {
        this.citizenRequestsPage = citizenRequestsPage;
    }

    async navigateAndVerify(): Promise<void> {
        await this.citizenRequestsPage.goto();
        await this.citizenRequestsPage.verifyPageIsLoaded();
    }

    async getTotalCount(): Promise<number> {
        return this.citizenRequestsPage.getRecordsCount();
    }

    async filterByStatus(status: RequestStatus): Promise<number> {
        await this.citizenRequestsPage.filterByStatus(status);
        return this.citizenRequestsPage.getRecordsCount();
    }

    async clearFilters(): Promise<number> {
        await this.citizenRequestsPage.clearFilters();
        return this.citizenRequestsPage.getRecordsCount();
    }

    async filterByTemplateName(name: string): Promise<number> {
        await this.citizenRequestsPage.filterByTemplateName(name);
        return this.citizenRequestsPage.getRecordsCount();
    }
}
