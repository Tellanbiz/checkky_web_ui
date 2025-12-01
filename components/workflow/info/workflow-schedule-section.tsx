"use client";

import { WorkspaceInfo } from "@/lib/services/workflows/models";

const formatDate = (
  dateString: string | { Microseconds: number; Valid: boolean }
) => {
  if (typeof dateString === "object" && dateString.Microseconds !== undefined) {
    // Handle PostgreSQL timestamp object
    const date = new Date(dateString.Microseconds / 1000);
    return date.toLocaleDateString();
  }

  const date = new Date(dateString as string);
  return date.toLocaleDateString();
};

const formatTime = (
  dateString: string | { Microseconds: number; Valid: boolean }
) => {
  if (typeof dateString === "object" && dateString.Microseconds !== undefined) {
    // Handle PostgreSQL timestamp object
    const date = new Date(dateString.Microseconds / 1000);
    return date.toLocaleTimeString();
  }

  const date = new Date(dateString as string);
  return date.toLocaleTimeString();
};

const formatScheduleInfo = (workflow: WorkspaceInfo) => {
  const { schedule_type, scheduled_time, day_of_week, day_of_month, month } =
    workflow;

  if (!scheduled_time) {
    return schedule_type.charAt(0).toUpperCase() + schedule_type.slice(1);
  }

  // Format time from "1:54PM" to "1:54 PM"
  const formatTime = (time: any) => {
    if (!time) return "";
    if (typeof time !== "string") {
      return "Invalid Time";
    }
    // Add space before AM/PM if not present
    return time.replace(/([AP]M)$/, " $1");
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

interface WorkflowScheduleSectionProps {
  workflow: WorkspaceInfo;
}

export function WorkflowScheduleSection({
  workflow,
}: WorkflowScheduleSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Schedule Information
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Automated execution schedule including timing, frequency, and
        timezone settings.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Schedule Type
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {workflow.schedule_type.charAt(0).toUpperCase() +
              workflow.schedule_type.slice(1)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Scheduled Time
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {workflow.scheduled_time}
          </p>
        </div>
        {workflow.schedule_type === "monthly" && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Day of Month
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {workflow.day_of_month}
              {getDaySuffix(workflow.day_of_month)}
            </p>
          </div>
        )}
        {workflow.schedule_type === "yearly" && (
          <>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Day of Month
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {workflow.day_of_month}
                {getDaySuffix(workflow.day_of_month)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Month
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(2000, workflow.month - 1).toLocaleString(
                  "default",
                  { month: "long" }
                )}
              </p>
            </div>
          </>
        )}
        <div>
          <label className="text-sm font-medium text-gray-500">
            Timezone
          </label>
          <p className="mt-1 text-sm text-gray-900">{workflow.timezone}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Created
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {formatDate(workflow.created_at)} at{" "}
            {formatTime(workflow.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
