import { test, type APIRequestContext } from "@playwright/test";
import { ApiHelper } from "./ApiHelper";
import { CreateDepartmentPayload, Department } from "../model/Department";
import { Routes } from "../routes/routes";
import { getSessionInstance, SessionKeys } from "../utils/SessionUtils";
import { hydrateWith } from "../utils/Utils";
import { TestLogger } from "../utils/TestLogger";


export class DepartmentService {
    private readonly api: ApiHelper;

    constructor(apiContext: APIRequestContext) {
        this.api = new ApiHelper(apiContext);
    }

    async createDepartment(department: Department, payload: CreateDepartmentPayload): Promise<Department> {
        const bearerToken = getSessionInstance().getFromSession(SessionKeys.BEARER)
        return test.step(`Create department "${payload.name}"`, async () => {
            const response = await this.api.request
                .path(`${process.env.API_URL}${Routes.DEPARTMENTS}`)
                .bearerToken(bearerToken)
                .body(payload)
                .postJson<{ data: { id: string } }>();

            const entity = hydrateWith(department, response, ({ data }) => ({ id: Number(data.id) }));
            TestLogger.logCustomMessage('Department created', entity);

            return entity;
        });
    }
}
