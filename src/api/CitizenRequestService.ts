import test, { APIRequestContext, APIResponse } from "@playwright/test";
import { ApiHelper } from "./ApiHelper";
import { CitizenRequestPayload } from "../model/CitizenRequest";
import { Routes } from "../routes/routes";

export class CitizenRequestService {
    private readonly api: ApiHelper;

    constructor(apiContext: APIRequestContext) {
        this.api = new ApiHelper(apiContext);
    }

    async submitCitizenRequest(
        payload: CitizenRequestPayload,
        unitId: number,
        bearerToken: string
    ): Promise<APIResponse> {
        return test.step(`Submit citizen request type ${payload.request_type_id} for unit ${unitId}`, async () => {
            return this.api.request
                .path(`${process.env.API_URL}${Routes.CITIZEN_REQUESTS(unitId)}`)
                .bearerToken(bearerToken)
                .multipart(this.buildMultipartBody(payload))
                .post();
        });
    }

    private buildMultipartBody(payload: CitizenRequestPayload): Record<string, string> {
        const { citizen_details, form_data, ...topLevel } = payload;
        const fields: Record<string, string> = {};

        for (const [key, value] of Object.entries(topLevel)) {
            fields[key] = String(value);
        }

        for (const [key, value] of Object.entries(citizen_details)) {
            fields[`citizen_details[${key}]`] = String(value);
        }

        if (form_data) {
            for (const [fieldId, value] of Object.entries(form_data)) {
                fields[`form_data[${fieldId}]`] = value;
            }
        }

        return fields;
    }

}
