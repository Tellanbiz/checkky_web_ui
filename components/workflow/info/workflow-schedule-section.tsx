"use client";

import { WorkspaceInfo } from "@/lib/services/workflows/models";
import {
  formatReminderText,
  formatWorkflowTimeList,
  parseWorkflowScheduleConfig,
} from "@/lib/workflow-schedule";

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
  const scheduleConfig = parseWorkflowScheduleConfig(workflow.scheduled_time);
  const formattedTimes = formatWorkflowTimeList(scheduleConfig.times);

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
          <label className="text-sm font-medium text-gray-500">Run Times</label>
          <p className="mt-1 text-sm text-gray-900">
            {formattedTimes}
          </p>
        </div>
        {(workflow.schedule_type === "daily" ||
          workflow.schedule_type === "weekly") && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Reminder
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {formatReminderText(scheduleConfig.reminderMinutes)}
            </p>
          </div>
        )}
        {workflow.schedule_type === "weekly" && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Day of Week
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {
                [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ][workflow.day_of_week]
              }
            </p>
          </div>
        )}
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
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-500">Summary</label>
          <p className="mt-1 text-sm text-gray-900">
            {workflow.schedule_type.charAt(0).toUpperCase() +
              workflow.schedule_type.slice(1)}{" "}
            workflow running at {formattedTimes}
            {(workflow.schedule_type === "daily" ||
              workflow.schedule_type === "weekly") &&
              ` with ${formatReminderText(scheduleConfig.reminderMinutes).toLowerCase()}.`}
          </p>
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
