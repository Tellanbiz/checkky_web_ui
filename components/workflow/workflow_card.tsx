import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlayCircle,
  PauseCircle,
  Calendar,
  MoreHorizontal,
  Trash2,
  Settings,
} from "lucide-react";
import {
  Workflow,
  WorkflowStatus,
  ChecklistPriority,
} from "@/lib/services/workflows/models";

interface WorkflowCardProps {
  workflow: Workflow;
  onClick: (id: string) => void;
  onDelete?: (workflow: Workflow) => void;
  onMenu?: (workflow: Workflow) => void;
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

  if (!scheduled_time) {
    return schedule_type.charAt(0).toUpperCase() + schedule_type.slice(1);
  }

  // Format time from "1:54PM" to "1:54 PM"
  const formatTime = (time: any) => {
    if (!time) return "";
    const safeTime = safeRender(time);
    if (safeTime === "Invalid Data" || safeTime === "N/A") {
      return "Invalid Time";
    }
    // Add space before AM/PM if not present
    return safeTime.replace(/([AP]M)$/, " $1");
  };

  const formattedTime = formatTime(scheduled_time);

  switch (schedule_type) {
    case "once":
      return `Once at ${formattedTime}`;

    case "daily":
      return `Daily at ${formattedTime}`;

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
        return `${days[day_of_week]} at ${formattedTime}`;
      }
      return `Weekly at ${formattedTime}`;

    case "monthly":
      if (day_of_month !== null) {
        const suffix = getDaySuffix(day_of_month);
        return `Monthly on the ${day_of_month}${suffix} at ${formattedTime}`;
      }
      return `Monthly at ${formattedTime}`;

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
        } ${day_of_month}${suffix} at ${formattedTime}`;
      }
      return `Yearly at ${formattedTime}`;
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
  onDelete,
  onMenu,
}: WorkflowCardProps) {
  const handleCardClick = () => {
    onClick(workflow.id);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMenu) {
      onMenu(workflow);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(workflow);
    }
  };

  return (
    <Card
      className="relative cursor-pointer hover:shadow-sm transition-all duration-200 bg-white border border-gray-200 rounded-lg"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2 px-3 pt-3 relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold truncate">
              {safeRender(workflow.title)}
            </CardTitle>
            {workflow.notes && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {safeRender(workflow.notes)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={handleMenuClick}
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-red-100"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div className="space-y-2.5">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {getStatusIcon(workflow.status)}
              <span
                className={`text-xs font-medium ${getStatusColor(
                  workflow.status
                )}`}
              >
                {workflow.status === "running" ? "Running" : "Stopped"}
              </span>
            </div>
            <Badge
              variant={getPriorityBadgeVariant(workflow.priority)}
              className="text-xs px-1.5 py-0.5 h-auto font-normal capitalize"
            >
              {safeRender(workflow.priority)}
            </Badge>
          </div>

          {/* Schedule Info */}
          <div className="space-y-1.5">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Schedule:</span>{" "}
              {formatScheduleInfo(workflow)}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span className="truncate max-w-[80px]">
                {safeRender(workflow.checklist_title)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(workflow.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorkflowCard;
