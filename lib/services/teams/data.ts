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