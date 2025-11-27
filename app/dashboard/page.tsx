"use client";

import { NewChecklistModal } from "../../components/checklist/new-checklist-modal";
import { useState, useEffect } from "react";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Plus,
  Loader2,
  User,
  Calendar,
} from "lucide-react";

import {
  getMonthlyReportAction,
  getYearlyReportAction,
} from "@/lib/services/reports/actions";
import { getAssignedChecklistsAction } from "@/lib/services/checklist/actions";
import { MonthlyReport, MonthlyTasks } from "@/lib/services/reports/models";
import { AssignedChecklist } from "@/lib/services/checklist/models";
import { useRouter } from "next/navigation";
import { DashboardCharts } from "@/components/dashboard-charts";
import { QuickActions } from "@/components/quick-actions";

const getPriorityDisplayName = (priority: string) => {
  switch (priority) {
    case "high":
      return "Major Must";
    case "mid":
      return "Minor Must";
    case "low":
      return "Optional";
    default:
      return priority;
  }
};

const getPriorityBadgeVariant = (priority: string) => {
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function Dashboard() {
  const router = useRouter();
  const [showNewChecklistModal, setShowNewChecklistModal] = useState(false);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [showNewGuidelineModal, setShowNewGuidelineModal] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(
    null
  );
  const [yearlyReport, setYearlyReport] = useState<MonthlyTasks | null>(null);
  const [assignedChecklists, setAssignedChecklists] = useState<
    AssignedChecklist[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [monthlyResult, yearlyResult, checklistsResult] =
          await Promise.all([
            getMonthlyReportAction(),
            getYearlyReportAction(),
            getAssignedChecklistsAction(),
          ]);

        if (monthlyResult.success && monthlyResult.data) {
          setMonthlyReport(monthlyResult.data);
        } else {
          console.error("Failed to fetch monthly report:", monthlyResult.error);
        }

        if (yearlyResult.success && yearlyResult.data) {
          setYearlyReport(yearlyResult.data);
        } else {
          console.error("Failed to fetch yearly report:", yearlyResult.error);
        }

        if (checklistsResult.success && checklistsResult.data) {
          setAssignedChecklists(checklistsResult.data);
        } else {
          console.error(
            "Failed to fetch assigned checklists:",
            checklistsResult.error
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate completion rate (handle NaN)
  const completionRate = monthlyReport
    ? Math.round(
        (monthlyReport.completed_checklists /
          (monthlyReport.completed_checklists +
            monthlyReport.pending_checklists) || 1) * 100
      ) || 0
    : 0;

  // Get priority tasks (high priority checklists)
  const priorityTasks = assignedChecklists.slice(0, 3); // Show only top 3

  const handleViewTask = (task: AssignedChecklist) => {
    router.push(`/dashboard/checklists/${task.id}`);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowNewChecklistModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Checklist
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Checklists
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyReport
                ? monthlyReport.completed_checklists +
                  monthlyReport.pending_checklists
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyReport
                ? `${monthlyReport.completed_checklists} completed, ${monthlyReport.pending_checklists} pending`
                : "Loading..."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyReport ? monthlyReport.total_members : 0}
            </div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {monthlyReport ? monthlyReport.pending_checklists : 0}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Checklist Completion Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<div>Loading charts...</div>}>
              <DashboardCharts yearlyData={yearlyReport} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Priority Tasks and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Priority Tasks</CardTitle>
            <CardDescription>
              High priority tasks requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityTasks.length > 0 ? (
                priorityTasks.map((task) => {
                  const progress =
                    task.checklist_progress.total_questions > 0
                      ? (task.checklist_progress.answered_questions /
                          task.checklist_progress.total_questions) *
                        100
                      : 0;

                  return (
                    <div
                      key={task.id}
                      className="flex items-center space-x-4 rounded-lg border p-4"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive">
                            {getPriorityDisplayName(task.priority)}
                          </Badge>
                          <Badge variant="outline">General</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{task.assigned_member.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <span>Progress: {Math.round(progress)}%</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-[#16A34A] h-1 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleViewTask(task)}>
                        View
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No high priority tasks found</p>
                  <p className="text-xs mt-1">All tasks are up to date!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions
              onOpenNewChecklist={() => setShowNewChecklistModal(true)}
              onOpenInviteMember={() => setShowInviteMemberModal(true)}
              onOpenNewGuideline={() => setShowNewGuidelineModal(true)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <NewChecklistModal
        isOpen={showNewChecklistModal}
        onClose={() => setShowNewChecklistModal(false)}
      />

      {/* TODO: Add other modals when they are implemented */}
      {/* <InviteMemberModal
        isOpen={showInviteMemberModal}
        onClose={() => setShowInviteMemberModal(false)}
      />
      <NewGuidelineModal
        isOpen={showNewGuidelineModal}
        onClose={() => setShowNewGuidelineModal(false)}
      /> */}
    </div>
  );
}
