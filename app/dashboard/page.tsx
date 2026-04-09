"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Loader2,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import {
  getOverviewReportAction,
  getYearlyReportAction,
} from "@/lib/services/reports/actions";
import { getAssignedChecklistsAction } from "@/lib/services/checklist/actions";
import { MonthlyTasks, OverviewReport } from "@/lib/services/reports/models";
import { AssignedChecklist } from "@/lib/services/checklist/models";
import { useRouter } from "next/navigation";
import { DashboardCharts } from "@/components/dashboard-charts";
import { useTeamMembers } from "@/components/team/members";
import { getAccount } from "@/lib/services/auth/auth-get";
import { Account } from "@/lib/services/accounts/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const searchParams = useSearchParams();
  const [selectedMemberId, setSelectedMemberId] = useState<string>("all");
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);
  const { data: teamMembers = [] } = useTeamMembers();

  const { data: account } = useQuery<Account>({
    queryKey: ["account"],
    queryFn: getAccount,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (searchParams.get("welcome") === "onboarding") {
      setShowOnboardingPrompt(true);
    }
  }, [searchParams]);

  const memberIdParam =
    selectedMemberId !== "all" ? selectedMemberId : undefined;

  const {
    data: yearlyReport,
    isLoading: yearlyLoading,
    error: yearlyError,
  } = useQuery({
    queryKey: ["dashboard", "yearly-report", memberIdParam],
    queryFn: async () => {
      const res = await getYearlyReportAction(memberIdParam);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch yearly report");
      }
      return res.data as MonthlyTasks;
    },
  });

  const {
    data: overviewReport,
    isLoading: overviewLoading,
    error: overviewError,
  } = useQuery({
    queryKey: ["dashboard", "overview-report", memberIdParam],
    queryFn: async () => {
      const res = await getOverviewReportAction(memberIdParam);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch overview report");
      }
      return res.data as OverviewReport;
    },
  });

  const {
    data: assignedChecklists = [],
    isLoading: assignedLoading,
    error: assignedError,
  } = useQuery({
    queryKey: ["dashboard", "assigned-checklists"],
    queryFn: async () => {
      const res = await getAssignedChecklistsAction();
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch assigned checklists");
      }
      return res.data as AssignedChecklist[];
    },
    staleTime: 1000 * 30,
  });

  // Calculate completion rate (handle NaN)
  const completionRate = overviewReport
    ? Math.round(Number(overviewReport.completion_rate) || 0)
    : 0;

  // Get priority tasks (high priority checklists)
  const visibleAssignedChecklists = memberIdParam
    ? assignedChecklists.filter((c) => c.member_id === memberIdParam)
    : assignedChecklists;

  const priorityTasks = visibleAssignedChecklists
    .filter((c) => c.priority === "high" && c.status === "pending")
    .slice(0, 3);


  if (yearlyLoading || overviewLoading || assignedLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const err = (yearlyError || overviewError || assignedError) as any;
  if (err) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            {err?.message || "Failed to load dashboard data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Dialog
        open={showOnboardingPrompt}
        onOpenChange={(open) => {
          setShowOnboardingPrompt(open);
          if (!open) {
            router.replace("/dashboard");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continue onboarding?</DialogTitle>
            <DialogDescription>
              Your account is ready. If you want, you can continue with the
              richer onboarding flow so we can tailor workflows, team setup, and
              checklist recommendations more precisely.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOnboardingPrompt(false);
                router.replace("/dashboard");
              }}
            >
              Maybe later
            </Button>
            <Button
              onClick={() => {
                setShowOnboardingPrompt(false);
                router.push("/dashboard/onboarding");
              }}
            >
              Continue onboarding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h2>
        <div className="w-full sm:w-[240px]">
          <Select
            value={selectedMemberId}
            onValueChange={setSelectedMemberId}
          >
            <SelectTrigger>
              <SelectValue placeholder="All team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All team</SelectItem>
              {teamMembers.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {account?.onboarding_required && (
        <Card className="border-primary/20 bg-white">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Get started with onboarding</p>
              <p className="text-sm text-muted-foreground">
                Complete your onboarding to tailor checklist suggestions,
                workflow setup, and team configuration to your operation.
              </p>
            </div>
            <Button onClick={() => router.push("/dashboard/onboarding")}>
              Continue onboarding
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Checklists
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewReport ? overviewReport.assigned_checklists : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {overviewReport
                ? `${overviewReport.completed_checklists} completed, ${overviewReport.pending_checklists} pending`
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
              {overviewReport ? overviewReport.total_members : 0}
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
              {overviewReport ? overviewReport.pending_checklists : 0}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Checklist Completion Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="w-full overflow-x-auto">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    Loading charts...
                  </div>
                }
              >
                <DashboardCharts
                  yearlyData={yearlyReport}
                  checklists={visibleAssignedChecklists}
                />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Tasks */}
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Priority Tasks</CardTitle>
            <CardDescription className="text-sm">
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
                      className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 rounded-lg border p-4"
                    >
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium leading-none">
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={getPriorityBadgeVariant(task.priority)}
                          >
                            {getPriorityDisplayName(task.priority)}
                          </Badge>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
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
                          <div className="flex-1 bg-gray-200 rounded-full h-1 min-w-0">
                            <div
                              className="bg-[#16A34A] h-1 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
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

      </div>

    </div>
  );
}
