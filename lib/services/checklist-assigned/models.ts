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

export enum PhotoAvailability {
  Yes = "Yes",
  No = "No",
}

export interface AssignedChecklistWithAnswer {
  id: string;
  name: string;
  description: string;
  created_at: string;
  sections: {
    order_index: number;
    question_group: string;
    questions: {
      id: number;
      question_group: string;
      checklist_item_caption: string;
      question_type: QuestionType;
      default_answer: string | null;
      photo_available: PhotoAvailability;
      answer_options: string[];
      corrective_actions: string[];
      policy: string | null;
      answer: string | null;
      is_answered: boolean;
    }[];
  }[];
}
