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

export interface TeamMember {
    id: string;
    role: string;
    user: {
        picture: string;
        full_name: string;
        email: string;
    };
    checklist_stats: {
        total: number;
        completed: number;
        pending: number;
    };
}



