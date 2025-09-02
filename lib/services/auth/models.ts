export interface AuthResult {
    access_token: string;
}

export interface SignUpParams {
    full_name: string;
    email: string;
    password: string;
}

export interface SignUpVerificationParams {
    code: string;
}