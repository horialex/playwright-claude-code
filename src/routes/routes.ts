export const Routes = {
    LOGIN: "/auth/login",
    DIGITAL_CITIZEN_DASHBOARD: '/idm',
    CITIZEN_REQUESTS: (unitId: number) => `/citizen/api/v1/unit/${unitId}/requests`,
    DEPARTMENTS: "/api/v1/departments",
};

export const DigitalCitizenPages = {
    CITIZEN: '/citizen',

}