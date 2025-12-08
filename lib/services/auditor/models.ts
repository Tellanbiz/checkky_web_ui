export interface AssignAuditorBody {
	member_id: string;
	assigned_checklist_id: string;
}

export interface ScoreParams {
    checklist_answer_id: string;
    score: 'pending' | 'not_compliant' | 'partially_compliant' | 'mostly_compliant' | 'fully_compliant';
}