import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  PauseCircle,
  Calendar,
  Settings,
} from "lucide-react";
import {
  Workflow,
  WorkflowStatus,
  ChecklistPriority,
} from "@/lib/services/workflows/models";
import {
  formatReminderText,
  formatWorkflowTimeList,
  parseWorkflowScheduleConfig,
} from "@/lib/workflow-schedule";

interface WorkflowCardProps {
  workflow: Workflow;
  onClick: (id: string) => void;
}

const getStatusIcon = (status: WorkflowStatus) => {
  switch (status) {
    case "running":
      return <PlayCircle className="h-4 w-4 text-green-500" />;
    case "stopped":
      return <PauseCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <PauseCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: WorkflowStatus) => {
  switch (status) {
    case "running":
      return "text-green-600";
    case "stopped":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

const getPriorityBadgeVariant = (priority: ChecklistPriority) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "mid":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const safeRender = (value: any): string => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value.toString();
  if (typeof value === "object") {
    // Handle PostgreSQL timestamp objects
    if (value.Microseconds !== undefined) {
      return formatDate(value);
    }
    // Handle role objects
    if (value.team_roles !== undefined) {
      return value.team_roles;
    }
    return "Invalid Data";
  }
  return String(value);
};

const formatScheduleInfo = (workflow: Workflow) => {
  const { schedule_type, scheduled_time, day_of_week, day_of_month, month } =
    workflow;
  const scheduleConfig = parseWorkflowScheduleConfig(scheduled_time);
  const formattedTimes = formatWorkflowTimeList(scheduleConfig.times);
  const reminderText = formatReminderText(scheduleConfig.reminderMinutes);

  if (!scheduled_time) {
    return schedule_type.charAt(0).toUpperCase() + schedule_type.slice(1);
  }

  switch (schedule_type) {
    case "once":
      return `Once at ${formattedTimes}`;

    case "daily":
      return `Daily at ${formattedTimes} (${reminderText})`;

    case "weekly":
      if (day_of_week !== null) {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        return `${days[day_of_week]} at ${formattedTimes} (${reminderText})`;
      }
      return `Weekly at ${formattedTimes} (${reminderText})`;

    case "monthly":
      if (day_of_month !== null) {
        const suffix = getDaySuffix(day_of_month);
        return `Monthly on the ${day_of_month}${suffix} at ${formattedTimes}`;
      }
      return `Monthly at ${formattedTimes}`;

    case "yearly":
      if (month !== null && day_of_month !== null) {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const suffix = getDaySuffix(day_of_month);
        return `${
          months[month - 1]
        } ${day_of_month}${suffix} at ${formattedTimes}`;
      }
      return `Yearly at ${formattedTimes}`;
  }
};

const getDaySuffix = (day: number) => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDate = (
  dateString:
    | string
    | { Microseconds: number; Valid: boolean }
    | null
    | undefined
) => {
  if (!dateString) return "N/A";

  // Handle PostgreSQL timestamp object
  if (typeof dateString === "object") {
    if (dateString.Microseconds !== undefined) {
      const date = new Date(dateString.Microseconds / 1000);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
    // Handle any other object format by returning a safe string
    return "Invalid Date";
  }

  // Handle string dates
  if (typeof dateString === "string") {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return "Invalid Date";
};

export function WorkflowCard({
  workflow,
  onClick,
}: WorkflowCardProps) {
  const handleCardClick = () => {
    onClick(workflow.id);
  };

  return (
    <Card
      className="relative cursor-pointer transition-all duration-200 bg-white border border-gray-300 rounded-lg"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {safeRender(workflow.title)}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(workflow.status)}
              <span
                className={`text-sm font-medium ${getStatusColor(
                  workflow.status
                )}`}
              >
                {workflow.status === "running" ? "Running" : "Stopped"}
              </span>
            </div>
            <Badge
              variant={getPriorityBadgeVariant(workflow.priority)}
              className="text-sm px-2 py-1 h-auto font-normal capitalize"
            >
              {safeRender(workflow.priority)}
            </Badge>
          </div>

          {/* Schedule Info */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Schedule:</span>{" "}
              {formatScheduleInfo(workflow)}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="truncate max-w-[120px]">
                {safeRender(workflow.checklist_title)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(workflow.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorkflowCard;
