export interface PendingEmailChange {
    id: string;
    new_email: string;
    requested_at: string;
    expires_at: string;
}

export interface Account {
    id: string;
    picture: string;
    full_name: string;
    email: string;
    current_company_id: string;
    pending_email_change?: PendingEmailChange | null;
}

export interface UpdateProfileParams {
    full_name: string;
    picture?: string;
}

export interface RequestEmailChangeParams {
    email: string;
}

export interface VerifyEmailChangeParams {
    code: string;
}

export interface Farm {
    id: string;
    name: string;
    location: string;
    country: string;
    size_ha: number;
    points: [number, number]; // [longitude, latitude]
    owner: Owner;
}



export interface Owner {
    id: string;
    full_name: string;
    email: string;
    farm?: {
        id: string;
        name: string;
    }
}
