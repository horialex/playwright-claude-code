import { test, type APIRequestContext, type APIResponse } from "@playwright/test";
import { ApiHelper } from "./ApiHelper";
import { CreateDepartmentPayload } from "../model/Department";
import { Routes } from "../routes/routes";
import { getSessionInstance, SessionKeys } from "../utils/SessionUtils";


export class DepartmentService {
    private readonly api: ApiHelper;

    constructor(apiContext: APIRequestContext) {
        this.api = new ApiHelper(apiContext);
    }

    async createDepartment(payload: CreateDepartmentPayload): Promise<APIResponse> {
        const bearerToken = getSessionInstance().getFromSession(SessionKeys.BEARER)
        return test.step(`Create department "${payload.name}"`, async () => {
            return this.api.request
                .path(`${process.env.API_URL}${Routes.DEPARTMENTS}`)
                .bearerToken(bearerToken)
                .body(payload)
                .post();
        });
    }
}
