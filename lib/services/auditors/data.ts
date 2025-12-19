export type ChecklistStatus = 'pending' | 'completed';
export type ChecklistPriority = 'high' | 'mid' | 'low';
export type TeamRoles = 'auditor' | 'admin' | 'super-admin' | 'member';

export interface User {
    picture?: string;
    full_name: string;
    email: string;
}

export interface Auditor {
    id: string;
    member_id: string;
    full_name: string;
    email: string;
    role: TeamRoles;
    picture?: string;
}

export interface ChecklistProgress {
    total_questions: number;
    answered_questions: number;
}

export interface AuditProgress {
    total_answers: number;
    scored_answers: number;
}

export interface AssignedMember {
    id: string;
    name: string;
    email: string;
}

export interface GetAuditorsRow {
    id: string;
    role: TeamRoles;
    user: User;
}

export interface GetOngoingAuditsRow {
    id: string;
    title: string;
    status: ChecklistStatus;
    priority: ChecklistPriority;
    created_at: string;
    assigned_member: AssignedMember | null;
    auditor: Auditor | null;
    checklist_progress: ChecklistProgress;
    audit_progress: AuditProgress;
}

export interface GetCompleteAuditsRow {
    id: string;
    title: string;
    status: ChecklistStatus;
    priority: ChecklistPriority;
    created_at: string;
    assigned_member: AssignedMember | null;
    auditor: Auditor | null;
    checklist_progress: ChecklistProgress;
    audit_progress: AuditProgress;
}