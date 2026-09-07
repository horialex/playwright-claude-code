export enum EmployeeAccess {
    ADD_RECORDS = 'Adăugare înregistrări',
    RESOLVE_RECORDS = 'Soluționări înregistrări',
    ADD_AND_RESOLVE = 'Adăugări și soluționări',
    ADMINISTRATION = 'Administrare',
}

export enum ResolutionRight {
    VIEW = 'Vizualizare',
    RESOLVE = 'Soluționare',
    SUPERVISE = 'Supervizare',
}

export enum EmployeeStatus {
    ACTIVE = 'Activ',
    INACTIVE = 'Inactiv',
}

// UI form model - what the Add Employee form collects.
export interface Employee {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    password: string;
    access: EmployeeAccess;
    /** At least one resolution right must be granted for the employee to be saved. */
    right: ResolutionRight;
    // Row-level data shown in the employees table (populated when verifying row details).
    department?: string;
    lastUpdatedDate?: string;
    status?: EmployeeStatus;
}

// API wire shapes - field names match the JSON exactly as sent/received over HTTP.
export interface EmployeeApiRecord {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_active: boolean;
}

export interface CreateEmployeePayload {
    last_name: string;
    first_name?: string;
    email: string;
    password: string;
    phone: string;
    // The docs list `type`/`category` as required too, but the app never sends them when
    // creating an employee (clerk) - they're defaulted server-side for this endpoint context.
    role_id: number;
    departments?: { department_id: number; acl: number }[];
}

// Domain-shaped API result (camelCase) - what services/tests work with once unmarshalled.
export interface EmployeeRecord {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isActive: boolean;
}
