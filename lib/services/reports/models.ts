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