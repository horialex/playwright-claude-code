import { DepartmentModule } from '@/constants/DepartmentConstants';

const DEPARTMENT_MODULE: Partial<Record<DepartmentModule, string>> = {
    [DepartmentModule.DOSAR_DIGITAL]: 'doc',
    [DepartmentModule.REGISTRATURA]: 'reg',
};

export const Routes = {
    LOGIN: "/auth/login",
    DIGITAL_CITIZEN_DASHBOARD: '/idm',
    CITIZEN_REQUESTS: (unitId: number) => `/citizen/api/v1/unit/${unitId}/requests`,
    DEPARTMENTS: (tab?: DepartmentModule) => {
        const module = tab ? DEPARTMENT_MODULE[tab] : undefined;
        return module ? `/api/v1/${module}/departments` : `/api/v1/departments`;
    },
};

export const DigitalCitizenPages = {
    CITIZEN: '/citizen',
};

export const DepartmentParentPages = {
    FLUX_DIGITAL: '/compartmentsreg',
    DOSAR_DIGITAL: '/compartmentsdoc',
    REGISTRATURA: '/compartmentsone',
};