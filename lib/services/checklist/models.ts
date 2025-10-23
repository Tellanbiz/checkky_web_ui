export interface CheckList {
    id: string;
    name: string;
    description: string;
    created_at: string;
    section_count: number;
    item_count: number;
}

export interface ChecklistInfo {
  id: string;
  name: string;
  description: string;
  created_at: string; // ISO timestamp
  sections: {
    order_index: number;
    question_group: string;
    questions: {
      id: number;
      question_group: string;
      checklist_item_caption: string;
      question_type: "RadioButton" | string;
      default_answer: string | null;
      photo_available: "Yes" | "No";
      answer_options: string[];
      corrective_actions: string[];
      policy: string | null;
    }[];
  }[];
}

export interface AssignedChecklist {
    id: string;
    title: string;
    notes: string;
    status: 'pending' | 'completed';
    priority: 'high' | 'mid' | 'low';
    member_id: string;
    checklist_id: string;
    created_at: string; // ISO timestamp or date string
    assigned_member: {
        id: string;
        name: string;
        email: string;
        can_answer: boolean;
    };
    checklist_progress: {
        total_questions: number;
        answered_questions: number;
    };
}

export interface AssignedChecklistParams {
    title: string;
    notes: string;
    priority: 'high' | 'mid' | 'low';
    checklist_id: string;
    member_id: string;
    section_id: string;
    deadline: string;
}