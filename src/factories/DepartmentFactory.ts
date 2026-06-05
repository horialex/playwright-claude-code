import { faker } from '@faker-js/faker';
import { ApiDepartmentType, CreateDepartmentPayload, Department, DepartmentStatus, DepartmentType } from '@/model/Department';


export class DepartmentFactory {
    static build(overrides: Partial<Department> = {}): Department {
        const today = new Date();
        const todayDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
        return {
            name: `Compartiment_${Date.now()}_${faker.string.numeric(6)}`,
            type: DepartmentType.DIRECTIE,
            description: faker.lorem.sentence(),
            status: DepartmentStatus.ACTIV,
            lastUpdatedDate: todayDate,
            clerks: [],
            ...overrides,
        } as Department;
    }

    static buildDirection(overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({
            type: DepartmentType.DIRECTIE,
            parent: undefined,
            name: `Compartiment_Directie_${Date.now()}_${faker.string.numeric(6)}`,
            ...overrides,
        });
    }

    static buildService(parent: string, overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({
            type: DepartmentType.SERVICIU,
            parent,
            name: `Compartiment_Serviciu_${Date.now()}_${faker.string.numeric(6)}`,
            ...overrides,
        });
    }

    static buildDepartment(parent: string, overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({
            type: DepartmentType.DEPARTAMENT,
            parent,
            name: `Compartiment_Departament_${Date.now()}_${faker.string.numeric(6)}`,
            ...overrides,
        });
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
