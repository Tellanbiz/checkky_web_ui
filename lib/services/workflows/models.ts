export type ScheduleType = "daily" | "weekly" | "monthly" | "yearly";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface WorkflowParams {
  ChecklistID: string;
  ScheduledTime: string; // ISO time string like "14:00:00"
  ScheduleType: ScheduleType;
  DayOfWeek: number;
  DayOfMonth: number;
  Month: number;
  Timezone: string;
  SectionID: string;
  MemberIDs: string[];
}
