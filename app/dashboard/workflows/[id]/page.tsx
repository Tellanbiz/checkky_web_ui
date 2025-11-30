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
} from "@/lib/services/workflows/services-get";
import {
  WorkflowDetail,
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

const formatScheduleInfo = (workflow: WorkflowDetail) => {
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
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
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

  const handleBack = () => {
    router.back();
  };

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
          <p className="text-sm text-gray-600 mb-4">
            The workflow you're looking for doesn't exist.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workflows
          </Button>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {workflow.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  {workflow.notes || "No description provided"}
                </p>

                {/* Status and Priority Badges */}
                <div className="flex items-center space-x-4 mb-4">
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

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Workflow
                  </Button>
                  <Button>
                    {workflow.status === "running" ? (
                      <>
                        <PauseCircle className="mr-2 h-4 w-4" />
                        Stop Workflow
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
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workflow Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Workflow Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Checklist
                    </label>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {workflow.checklist_title}
                    </p>
                    {workflow.checklist_description && (
                      <p className="mt-1 text-xs text-gray-500">
                        {workflow.checklist_description}
                      </p>
                    )}
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
              </CardContent>
            </Card>

            {/* Schedule Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-900">
                  {formatScheduleInfo(workflow)}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Team Members ({members.length})
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No team members assigned
                  </p>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {member.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            {formatRole(member.role)}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined {formatDate(member.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Schedule Type</span>
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {workflow.schedule_type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Team Members</span>
                  </div>
                  <span className="text-sm font-medium">{members.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Job ID</span>
                  </div>
                  <span className="text-sm font-medium">
                    #{workflow.job_id}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
