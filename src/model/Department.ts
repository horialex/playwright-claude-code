import { Clerk } from '@/model/Clerk';

export enum DepartmentType {
    DIRECTIE = 'direcție',
    DEPARTAMENT = 'departament',
    SERVICIU = 'serviciu',
}

export enum DepartmentStatus {
    ACTIV = 'activ',
    INACTIV = 'inactiv',
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
    status: DepartmentStatus;
    lastUpdatedDate: string;
    clerks: Clerk[];
}


export interface CreateDepartmentPayload {
    name: string;
    type: string;
    description: string;
    unit_id: number;
    status: number;
    parent_id?: number;
}
