import { faker } from '@faker-js/faker';
import { Department, DepartmentType } from '@/model/Department';


export class DepartmentFactory {
    static build(overrides: Partial<Department> = {}): Department {
        return {
            name: `Compartiment_${Date.now()}_${faker.string.numeric(6)}`,
            type: DepartmentType.DIRECTIE,
            description: faker.lorem.sentence(),
            ...overrides,
        };
    }

    static buildDirectie(overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({ ...overrides, type: DepartmentType.DIRECTIE, parent: undefined, name: `Compartiment_Directie_${Date.now()}_${faker.string.numeric(6)}` });
    }

    static buildServiciu(parent: string, overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({ ...overrides, type: DepartmentType.SERVICIU, parent, name: `Compartiment_Serviciu_${Date.now()}_${faker.string.numeric(6)}` });
    }

    static buildDepartment(parent: string, overrides: Partial<Department> = {}): Department {
        return DepartmentFactory.build({ ...overrides, type: DepartmentType.DEPARTAMENT, parent, name: `Compartiment_Departament_${Date.now()}_${faker.string.numeric(6)}` });
    }
}
