export interface AuthResult {
    access_token: string;
}

export interface SignUpParams {
    full_name: string;
    email: string;
    password: string;
    repassword: string;
    country: string;
    team_members: string;
    industry: string;
    position: string;
}

export interface SignUpVerificationParams {
    code: string;
}
