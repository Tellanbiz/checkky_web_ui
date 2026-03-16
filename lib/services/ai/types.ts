export interface AIChecklistDraftQuestion {
  checklist_item_caption: string;
  question_type: string;
  default_answer: string;
  photo_available: string;
  answer_options: string[];
  corrective_actions: string[];
  policy: string;
}

export interface AIChecklistDraftSection {
  order_index: number;
  question_group: string;
  questions: AIChecklistDraftQuestion[];
}

export interface AIChecklistDraft {
  checklist_title: string;
  description: string;
  context_summary: string;
  assumptions: string[];
  follow_up_questions: string[];
  sections: AIChecklistDraftSection[];
}

export interface GenerateAIChecklistData {
  session_id?: string;
  name: string;
  category: string;
  industry: string;
  goal: string;
  audience?: string;
  site_context?: string;
  standards?: string;
  must_include?: string;
  existing_context?: string;
  prompt?: string;
}

export interface GenerateAIChecklistResponse {
  session_id: string;
  generation_id: string;
  draft: AIChecklistDraft;
}

export interface CreateChecklistFromAIData {
  generation_id: string;
  name: string;
  description: string;
  category: string;
  checklist_group_id?: number;
  is_public?: boolean;
}

export interface CreateChecklistFromAIResponse {
  checklist_id: string;
  message: string;
}
