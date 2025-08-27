export interface InviteParams {
    invites: {
        email: string;
        role: "admin" | "auditor" | "assignee" | "viewer";
    }[]
}

export interface TeamInvite {
    id: string;
    role: string;
    email: string;
    status: string;
    created_at: string;
}

export interface TeamInviteInfo {
    id: string;
    role: string;
    email: string;
    status: string;
    created_at: string;
    company: {
        name: string;
        email: string;
    }
}