"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  CheckCircle,
  User,
  AlertCircle,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCompleteAudits } from "@/lib/services/auditors/get";
import { GetCompleteAuditsRow } from "@/lib/services/auditors/data";
import { useToast } from "@/hooks/use-toast";

export default function CompleteAuditsPage() {
  const [audits, setAudits] = useState<GetCompleteAuditsRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAudits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCompleteAudits();
      setAudits(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load completed audits"
      );
      toast({
        title: "Error",
        description: "Failed to load completed audits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAudits();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "mid":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (total: number, completed: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={loadAudits} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadAudits} disabled={isLoading}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Completed Audits
          </h1>
          <p className="text-muted-foreground">
            Audits that have been fully completed with all answers scored
          </p>
        </div>
        <Button variant="outline" onClick={loadAudits} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Completed
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audits.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {audits.filter((a) => a.priority === "high").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audits List */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Audits</CardTitle>
          <CardDescription>
            All audits that have been fully scored and completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audits.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No completed audits found</p>
              <p className="text-sm text-gray-400 mt-1">
                Completed audits will appear here once all answers have been
                scored
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {audits.map((audit) => (
                <div
                  key={audit.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {audit.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(
                          audit.priority
                        )}`}
                      >
                        {audit.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(audit.status)}`}
                      >
                        {audit.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-100 text-green-800 border-green-200"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>
                          Assignee:{" "}
                          {audit.assigned_member?.name || "Unassigned"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>
                          Auditor: {audit.auditor?.full_name || "Unassigned"}
                        </span>
                      </div>
                      <span>Created: {formatDate(audit.created_at)}</span>
                    </div>

                    {/* Progress bars */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Checklist Progress</span>
                          <span>
                            {audit.checklist_progress.answered_questions}/
                            {audit.checklist_progress.total_questions}
                          </span>
                        </div>
                        <Progress
                          value={calculateProgress(
                            audit.checklist_progress.total_questions,
                            audit.checklist_progress.answered_questions
                          )}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Audit Progress</span>
                          <span>
                            {audit.audit_progress.scored_answers}/
                            {audit.audit_progress.total_answers}
                          </span>
                        </div>
                        <Progress
                          value={calculateProgress(
                            audit.audit_progress.total_answers,
                            audit.audit_progress.scored_answers
                          )}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>

                  {audit.auditor && (
                    <div className="ml-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={audit.auditor.picture}
                          alt={audit.auditor.full_name}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
                          {getInitials(audit.auditor.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
