import { faker } from '@faker-js/faker';
import { ApiDepartmentType, CreateDepartmentPayload, Department, DepartmentType } from '@/model/Department';


export class DepartmentFactory {
    static build(overrides: Partial<Department> = {}): Department {
        return {
            name: `Compartiment_${Date.now()}_${faker.string.numeric(6)}`,
            type: DepartmentType.DIRECTIE,
            description: faker.lorem.sentence(),
            ...overrides,
        };
    }

    static buildDirection(overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({ ...overrides, type: DepartmentType.DIRECTIE, parent: undefined, name: `Compartiment_Directie_${Date.now()}_${faker.string.numeric(6)}` });
    }

    static buildService(parent: string, overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({ ...overrides, type: DepartmentType.SERVICIU, parent, name: `Compartiment_Serviciu_${Date.now()}_${faker.string.numeric(6)}` });
    }

    static buildDepartment(parent: string, overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({ ...overrides, type: DepartmentType.DEPARTAMENT, parent, name: `Compartiment_Departament_${Date.now()}_${faker.string.numeric(6)}` });
    }

    static toPayload(department: Department, unitId: number, parentId?: number): CreateDepartmentPayload {
        const apiTypeMap: Record<DepartmentType, ApiDepartmentType> = {
            [DepartmentType.DIRECTIE]: ApiDepartmentType.DIRECTION,
            [DepartmentType.SERVICIU]: ApiDepartmentType.SERVICE,
            [DepartmentType.DEPARTAMENT]: ApiDepartmentType.DEPARTMENT,
        };
        return {
            name: department.name,
            type: apiTypeMap[department.type],
            description: department.description,
            unit_id: unitId,
            status: 1,
            ...(parentId !== undefined && { parent_id: parentId }),
        };
    }
}
