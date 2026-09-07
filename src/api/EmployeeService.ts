import { test, expect, type APIRequestContext } from "@playwright/test";
import { ApiHelper } from "./ApiHelper";
import { Routes } from "@/routes/routes";
import { getSessionInstance, SessionKeys } from "@/utils/SessionUtils";
import { CreateEmployeePayload, EmployeeApiRecord, EmployeeRecord } from "@/model/Employee";

type EmployeesResponse = {
    data: EmployeeApiRecord[];
};

type EmployeeResponse = {
    data: EmployeeApiRecord;
};

export class EmployeeService {
    private readonly api: ApiHelper;

    constructor(apiContext: APIRequestContext) {
        this.api = new ApiHelper(apiContext);
    }

    async getEmployees(): Promise<EmployeeRecord[]> {
        const bearerToken = getSessionInstance().getFromSession(SessionKeys.BEARER);
        return test.step('Get employees', async () => {
            const { data } = await this.api.request
                .path(`${process.env.API_URL}${Routes.USERS}`)
                .bearerToken(bearerToken)
                .expectStatus(200)
                .getJson<EmployeesResponse>();

            return data.map(record => this.toEmployeeRecord(record));
        });
    }

    async getEmployeeById(id: number): Promise<EmployeeRecord> {
        const bearerToken = getSessionInstance().getFromSession(SessionKeys.BEARER);
        return test.step(`Get employee by id: ${id}`, async () => {
            const { data } = await this.api.request
                .path(`${process.env.API_URL}${Routes.USER(id)}`)
                .bearerToken(bearerToken)
                .expectStatus(200)
                .getJson<EmployeeResponse>();

            return this.toEmployeeRecord(data);
        });
    }

    async createEmployee(payload: CreateEmployeePayload): Promise<EmployeeRecord> {
        const bearerToken = getSessionInstance().getFromSession(SessionKeys.BEARER);
        return test.step(`Create employee: ${payload.email}`, async () => {
            const { data } = await this.api.request
                .path(`${process.env.API_URL}${Routes.USERS}`)
                .bearerToken(bearerToken)
                .body(payload)
                .expectStatus(201)
                .postJson<{ data: { id: string } }>();

            return this.getEmployeeById(Number(data.id));
        });
    }

    async verifyEmployeeExists(email: string): Promise<void> {
        await test.step(`Verify employee exists via API: ${email}`, async () => {
            const employees = await this.getEmployees();
            console.log(JSON.stringify(employees))
            expect(employees.some(employee => employee.email === email)).toBe(true);
        });
    }

    async verifyEmployeeExistsById(id: number, email: string): Promise<void> {
        await test.step(`Verify employee exists via API: ${id}`, async () => {
            const employee = await this.getEmployeeById(id);
            expect(employee.email).toBe(email);
        });
    }

    private toEmployeeRecord(raw: EmployeeApiRecord): EmployeeRecord {
        return {
            id: raw.id,
            firstName: raw.first_name,
            lastName: raw.last_name,
            email: raw.email,
            phone: raw.phone,
            isActive: raw.is_active,
        };
    }
}
