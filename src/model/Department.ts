export enum DepartmentType {
    DIRECTIE = 'direcție',
    DEPARTAMENT = 'departament',
    SERVICIU = 'serviciu',
}

export interface Department {
    name: string;
    type: DepartmentType;
    description: string;
    parent?: string;
}

export interface CreateDepartmentPayload {
    name: string;
    type: string;
    description: string;
    unit_id: number;
    status: number;
}
