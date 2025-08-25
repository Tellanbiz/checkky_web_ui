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
    created_at: string;
    sections: {
        order_index: number;
        question_group: string;
        questions: {
            id: string;
            question_group: string;
            checklist_item_caption: string;
            question_type: string;
            corrective_action_options: string;
            default_answer: string;
            photo_available: string;
            answer_option1: string;
            answer_option2: string;
            answer_option3: string | null;
            answer_option4: string | null;
            answer_option5: string | null;
            answer_option6: string | null;
            answer_option7: string | null;
            answer_option8: string | null;
            answer_option9: string | null;
            answer_option10: string | null;
            corrective_action_option1: string | null;
            corrective_action_option2: string | null;
            corrective_action_option3: string | null;
            corrective_action_option4: string | null;
            corrective_action_option5: string | null;
            corrective_action_option6: string | null;
            corrective_action_option7: string | null;
            corrective_action_option8: string | null;
            corrective_action_option9: string | null;
            corrective_action_option10: string | null;
            policy: string | null;
        }[];
    }[];
}