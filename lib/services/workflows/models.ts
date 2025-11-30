export type ScheduleType = "once" | "daily" | "weekly" | "monthly" | "yearly";
export type WorkflowStatus = "running" | "stopped";
export type ChecklistPriority = "high" | "mid" | "low";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface WorkflowParams {
  title: string;
  notes: string;
  priority: ChecklistPriority;
  checklist_id: string;
  schedule_type: ScheduleType;
  scheduled_time: string; // Format like "1:54PM"
  day_of_month: number;
  month: number;
  geofence_enabled: boolean;
  timezone: string;
  section_id: string;
  members: string[];
}

export interface Workflow {
  id: string;
  title: string;
  notes: string;
  priority: ChecklistPriority;
  status: WorkflowStatus;
  schedule_type: ScheduleType;
  scheduled_time: string | null;
  day_of_week: number | null;
  day_of_month: number | null;
  month: number | null;
  timezone: string;
  checklist_id: string;
  section_id: string | null;
  job_id: number;
  created_at: string | { Microseconds: number; Valid: boolean };
  checklist_title: string;
  checklist_description?: string; // Make optional for Workflow, required for WorkflowDetail
}

export interface WorkflowDetail extends Omit<Workflow, 'checklist_description'> {
  checklist_description: string; // Required for detail view
}

export interface WorkflowMember {
  id: string;
  user_id: string;
  role: string | { team_roles: string; valid: boolean };
  full_name: string;
  email: string;
  phone: string;
  created_at: string | { Microseconds: number; Valid: boolean };
}
