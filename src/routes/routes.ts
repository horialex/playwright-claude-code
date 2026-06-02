import { DepartmentParent } from '@/constants/DepartmentConstants';

export const Routes = {
    LOGIN: "/auth/login",
    DIGITAL_CITIZEN_DASHBOARD: '/idm',
    CITIZEN_REQUESTS: (unitId: number) => `/citizen/api/v1/unit/${unitId}/requests`,
    DEPARTMENTS: "/api/v1/departments",
};

export const DigitalCitizenPages = {
    CITIZEN: '/citizen',
};

export const DepartmentParentPages = {
    FLUX_DIGITAL: '/compartmentsreg',
    DOSAR_DIGITAL: '/compartmentsdoc',
    REGISTRATURA: '/compartmentsone',
};