import { test, type APIRequestContext } from "@playwright/test";
import { ApiHelper } from "./ApiHelper";
import { CreateDepartmentPayload, Department } from "@/model/Department";
import { Routes } from "@/routes/routes";
import { DepartmentModule } from "@/constants/DepartmentConstants";
import { getSessionInstance, SessionKeys } from "@/utils/SessionUtils";
import { hydrateWith } from "@/utils/Utils";
import { TestLogger } from "@/utils/TestLogger";
import { DepartmentFactory } from "@/factories/DepartmentFactory";
import { application } from "@/config/apps";


export class DepartmentService {
    private readonly api: ApiHelper;

    constructor(apiContext: APIRequestContext) {
        this.api = new ApiHelper(apiContext);
    }

    async createDirection(module?: DepartmentModule): Promise<Department> {
        const directionData = DepartmentFactory.buildDirection();
        return this.create(directionData, DepartmentFactory.toPayload(directionData, application.unitId), module);
    }

    async createService(directionParent: Department, module?: DepartmentModule): Promise<Department> {
        const serviceData = DepartmentFactory.buildService(directionParent.name);
        return this.create(serviceData, DepartmentFactory.toPayload(serviceData, application.unitId, directionParent.id), module);
    }

    async createDepartment(serviceParent: Department, module?: DepartmentModule): Promise<Department> {
        const departmentData = DepartmentFactory.buildDepartment(serviceParent.name);
        return this.create(departmentData, DepartmentFactory.toPayload(departmentData, application.unitId, serviceParent.id), module);
    }

    private async create(department: Department, payload: CreateDepartmentPayload, module?: DepartmentModule): Promise<Department> {
        const bearerToken = getSessionInstance().getFromSession(SessionKeys.BEARER)
        return test.step(`Create department "${payload.name}"`, async () => {
            const response = await this.api.request
                .path(`${process.env.API_URL}${Routes.DEPARTMENTS(module)}`)
                .bearerToken(bearerToken)
                .body(payload)
                .postJson<{ data: { id: string } }>();

            const entity = hydrateWith(department, response, ({ data }) => ({ id: Number(data.id) }));
            TestLogger.logCustomMessage('Department created', entity);

            return entity;
        });
    }

}
