export interface CitizenDetails {
    last_name: string;
    first_name: string;
    cif: string;
    phone: string;
    email: string;
    state: string;
    city: string;
    street: string;
    number: string;
    id: number;
    category: string;
}

export interface CitizenRequestPayload {
    citizen_identification_value: string;
    citizen_details: CitizenDetails;
    short_description: string;
    request_type_id: number;
    form_data?: Record<number, string>;
}
