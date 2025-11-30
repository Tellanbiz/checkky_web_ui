"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  PlayCircle,
  PauseCircle,
  Clock,
  Users,
  Calendar,
  Settings,
  FileText,
  Edit,
} from "lucide-react";
import {
  getWorkflowById,
  getWorkflowMembers,
} from "@/lib/services/workflows/get";
import {
  WorkspaceInfo,
  WorkflowMember,
  WorkflowStatus,
  ChecklistPriority,
} from "@/lib/services/workflows/models";

const priorityColors = {
  high: "bg-red-100 text-red-800",
  mid: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const statusColors = {
  running: "bg-green-100 text-green-800",
  stopped: "bg-gray-100 text-gray-800",
};

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

const formatRole = (role: string | { team_roles: string; valid: boolean }) => {
  if (typeof role === "string") {
    return role;
  }
  return role?.team_roles || "Member";
};

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<WorkspaceInfo | null>(null);
  const [members, setMembers] = useState<WorkflowMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      setLoading(true);
      try {
        const [workflowData, membersData] = await Promise.all([
          getWorkflowById(params.id as string),
          getWorkflowMembers(params.id as string),
        ]);

        setWorkflow(workflowData);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch workflow details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/dashboard/workflows/${params.id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading workflow details...</p>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Workflow Not Found
          </h3>
          <p className="text-sm text-gray-600">
            The workflow you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      {/* Page Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {workflow.title}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Workflow
              </Button>
              <Button>
                {workflow.status === "running" ? (
                  <>
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Pause Workflow
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Workflow
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 pb-12 space-y-6">
        {/* Status and Priority */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Status & Priority
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Current workflow status and priority level for execution and
            monitoring.
          </p>
          <div className="flex items-center space-x-4">
            <Badge className={statusColors[workflow.status]}>
              {workflow.status === "running" ? (
                <>
                  <PlayCircle className="mr-1 h-3 w-3" />
                  Running
                </>
              ) : (
                <>
                  <PauseCircle className="mr-1 h-3 w-3" />
                  Stopped
                </>
              )}
            </Badge>
            <Badge className={priorityColors[workflow.priority]}>
              {workflow.priority} priority
            </Badge>
          </div>
          <p className="mt-4 text-gray-600">
            {workflow.notes || "No description provided"}
          </p>
        </div>

        {/* Schedule Information */}
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

        {/* Location Information */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Location Information
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Geographic location and section details where this workflow is
            assigned to run.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Section Name
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {workflow.section.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Location
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {workflow.section.location}
              </p>
            </div>
          </div>
        </div>

        {/* Checklist Information */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Checklist Information
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            The checklist template that defines the tasks and procedures for
            this workflow.
          </p>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Checklist
            </label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {workflow.checklist.name}
            </p>
            {workflow.checklist.description && (
              <p className="mt-1 text-xs text-gray-500">
                {workflow.checklist.description}
              </p>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Team Members ({members.length})
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Team members assigned to this workflow who will receive
            notifications and handle execution.
          </p>
          {members.length === 0 ? (
            <p className="text-sm text-gray-500">No team members assigned</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {member.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatRole(member.role)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.phone}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
