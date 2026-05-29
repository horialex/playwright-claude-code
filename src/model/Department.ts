export enum DepartmentType {
    DIRECTIE = 'direcție',
    DEPARTAMENT = 'departament',
    SERVICIU = 'serviciu',
}

export enum ApiDepartmentType {
    DIRECTION = 'direction',
    SERVICE = 'service',
    DEPARTMENT = 'department',
}

export interface Department {
    id?: number;
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
    parent_id?: number;
}
