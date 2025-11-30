export type ScheduleType = "once" | "daily" | "weekly" | "monthly" | "yearly";
export type WorkflowStatus = "running" | "stopped";
export type ChecklistPriority = "high" | "mid" | "low";

export interface WorkspaceInfo {
  id: string;
  title: string;
  notes: string;
  priority: ChecklistPriority;
  status: WorkflowStatus;
  schedule_type: ScheduleType;
  scheduled_time: string;
  day_of_week: number;
  day_of_month: number;
  month: number;
  timezone: string;
  checklist_id: string;
  created_at: string;
  section: {
    id: string;
    name: string;
    location: string;
  };
  checklist: {
    id: string;
    name: string;
    description: string;
  };
}

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
  priority: ChecklistPriority;
  status: WorkflowStatus;
  schedule_type: ScheduleType;
  scheduled_time: string;
  day_of_week: number;
  day_of_month: number;
  month: number;
  timezone: string;
  created_at: string;
  checklist_title: string;
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
