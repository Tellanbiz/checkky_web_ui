export enum QuestionType {
  RadioButton = "RadioButton",
  Text = "Text",
  SmartView = "SmartView",
  Statement = "Statement",
  CheckBoxList = "CheckBoxList",
  CorrectiveActionMulti = "Corrective Action Multi",
  CorrectiveMulti = "Corrective Multi",
  Table = "Table",
  Matrix = "Matrix",
  CheckboxList = "Checkbox list",
  Date = "Date",
  Decimal = "Decimal",
  Integer = "Integer",
  ItemList = "Item List",
  ManagedList = "Managed List",
  Memo = "Memo",
  RadiobuttonList = "Radiobutton List",
  RecordList = "Record List",
  Signature = "Signature",
  Supplier = "Supplier",
  Temperature = "Temperature",
  Time = "Time",
}

export enum AuditScore {
  Pending = "pending",
  NotCompliant = "not_compliant",
  PartiallyCompliant = "partially_compliant",
  MostlyCompliant = "mostly_compliant",
  FullyCompliant = "fully_compliant",
}

export enum PhotoAvailability {
  Yes = "Yes",
  No = "No",
}

export interface AssignedChecklistWithAnswer {
  id: string;
  name: string;
  description: string;
  created_at: string;
  status: 'pending' | 'in_progress' | 'completed';
  auditor?: {
    email: string;
    full_name: string;
    id: string;
    member_id: string;
    role: string;
    checklist_status: string
  },
  sections: {
    order_index: number;
    question_group: string;
    questions: {
      id: number;
      checklist_answer_id?: string;
      question_group: string;
      checklist_item_caption: string;
      question_type: QuestionType;
      default_answer: string | null;
      photo_available: PhotoAvailability;
      answer_options: string[];
      corrective_option?: string | null;
      corrective_actions: string[];
      policy: string | null;
      answer: string | null;
      is_answered: boolean;
      score: AuditScore;
      perc_score: number;
    }[];
  }[];
}
