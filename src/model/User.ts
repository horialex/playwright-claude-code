import { GenderOptions } from "../constants/DigitalCitizenConstants";

export interface UserCredentials {
    email: string;
    pass: string;
    username: string;
    emailPrefix: string;
}

export interface UserPersonalInformation {
    userName?: string;
    lastName?: string;
    telephone?: number;
    sex?: GenderOptions;
    workStudyOtherLocation?: boolean;
    workStudyLocation?: string;
}

