import { UserCredentials } from '@/model/User';

export const citizen: UserCredentials = {
    email: process.env.CITIZEN_EMAIL!,
    pass: process.env.CITIZEN_PASS!,
    username: process.env.CITIZEN_USERNAME!,
    emailPrefix: process.env.CITIZEN_EMAIL!.split('@')[0],
};

export const admin: UserCredentials = {
    email: process.env.ADMIN_EMAIL!,
    pass: process.env.ADMIN_PASS!,
    username: process.env.ADMIN_USERNAME!,
    emailPrefix: process.env.ADMIN_EMAIL!.split('@')[0],
};
