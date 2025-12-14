export interface MonthlyTasks {
    [month: string]: {
        pending: number;
        completed: number;
    };
}

export interface MonthlyReport {
    pending_checklists: number;
    completed_checklists: number;
    total_members: number;
}

export interface OverviewReport {
    total_members: number;
    total_checklists: number;
    total_farms: number;
    assigned_checklists: number;
    completed_checklists: number;
    pending_checklists: number;
    completion_rate: number;
}