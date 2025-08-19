interface InviteParams {
    invites: {
        email: string;
        role: "admin" | "auditor" | "assignee" | "viewer";
    }[]
}