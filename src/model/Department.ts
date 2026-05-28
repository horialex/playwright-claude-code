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
