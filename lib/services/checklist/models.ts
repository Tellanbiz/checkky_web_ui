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
    created_at: string; // ISO date string
    sections: ChecklistSection[];
}

export interface ChecklistSection {
    id: string;
    title: string;
    order_index: number;
    questions: ChecklistItem[];
}

export interface ChecklistItem {
    id: string;
    question: string;
    requirement_code: string;
    is_mandatory: boolean;
    order_index: number;
    guidance: string | null;
}
