import { faker } from '@faker-js/faker';
import { CreateEmployeePayload, Employee, EmployeeAccess, EmployeeStatus, ResolutionRight } from '@/model/Employee';

export class EmployeeFactory {
    static build(overrides: Partial<Employee> = {}): Employee {
        const unique = `${Date.now()}${faker.string.numeric(4)}`;
        const today = new Date();
        // The employees table renders the last-edited date as DD/MM/YYYY HH:mm; match the date part.
        const todayDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        return {
            lastName: `Test_${faker.person.lastName()}`,
            firstName: faker.person.firstName(),
            email: `employee_${unique}@example.com`,
            phone: `07${faker.string.numeric(8)}`,
            password: `Test!${faker.string.numeric(6)}`,
            access: EmployeeAccess.ADD_RECORDS,
            right: ResolutionRight.VIEW,
            lastUpdatedDate: todayDate,
            status: EmployeeStatus.ACTIVE,
            ...overrides,
        };
    }

    static buildApiPayload(overrides: Partial<CreateEmployeePayload> = {}): CreateEmployeePayload {
        const unique = `${Date.now()}${faker.string.numeric(4)}`;
        return {
            last_name: `Test_${faker.person.lastName()}`,
            first_name: faker.person.firstName(),
            email: `employee_${unique}@example.com`,
            phone: `07${faker.string.numeric(8)}`,
            password: `Test!${faker.string.numeric(6)}`,
            // 3 is the role id the app sends for EmployeeAccess.ADD_RECORDS (confirmed via network capture).
            role_id: 3,
            ...overrides,
        };
    }
}
