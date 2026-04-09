"use client";

import { CheckCircle2, Clock3, MapPin, Shield, Users, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WorkflowParams } from "@/lib/services/workflows/models";
import {
  formatReminderText,
  formatWorkflowTimeList,
  parseWorkflowScheduleConfig,
} from "@/lib/workflow-schedule";

interface WorkflowEditorShellProps {
  title: string;
  description: string;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitDisabled: boolean;
  uploadProgress?: number;
  workflowName: string;
  formData: WorkflowParams;
  children: React.ReactNode;
}

function buildScheduleLabel(formData: WorkflowParams) {
  const scheduleConfig = parseWorkflowScheduleConfig(formData.scheduled_time);
  const times = formatWorkflowTimeList(scheduleConfig.times);
  const reminder = formatReminderText(scheduleConfig.reminderMinutes);

  switch (formData.schedule_type) {
    case "weekly":
      return `Weekly on ${
        [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][formData.day_of_week ?? 1]
      } at ${times}${reminder === "No reminder" ? "" : `, ${reminder.toLowerCase()}`}`;
    case "monthly":
      return `Monthly on day ${formData.day_of_month} at ${times}`;
    case "yearly":
      return `Yearly on ${formData.month}/${formData.day_of_month} at ${times}`;
    default:
      return `Daily at ${times}${reminder === "No reminder" ? "" : `, ${reminder.toLowerCase()}`}`;
  }
}

export function WorkflowEditorShell({
  title,
  description,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
  isSubmitting,
  submitDisabled,
  uploadProgress,
  workflowName,
  formData,
  children,
}: WorkflowEditorShellProps) {
  const summaryItems = [
    {
      label: "Workflow name",
      ready: Boolean(workflowName.trim()),
      value: workflowName.trim() || "Add a clear name",
      icon: Workflow,
    },
    {
      label: "Checklist",
      ready: Boolean(formData.checklist_id),
      value: formData.checklist_id ? "Checklist selected" : "Choose a checklist",
      icon: CheckCircle2,
    },
    {
      label: "Schedule",
      ready: Boolean(formData.scheduled_time),
      value: buildScheduleLabel(formData),
      icon: Clock3,
    },
    {
      label: "Location",
      ready: Boolean(formData.section_id),
      value: formData.section_id ? "Location selected" : "Select a location",
      icon: MapPin,
    },
    {
      label: "Members",
      ready: formData.members.length > 0,
      value:
        formData.members.length > 0
          ? `${formData.members.length} team member(s) assigned`
          : "Assign at least one team member",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <Card className="bg-white">
        <CardContent className="px-6 py-6 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onSubmit}
                disabled={submitDisabled}
                className="min-w-[170px]"
              >
                {isSubmitting ? submittingLabel : submitLabel}
              </Button>
            </div>
          </div>

          {isSubmitting && typeof uploadProgress === "number" && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{submittingLabel}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">{children}</div>

        <div className="space-y-6">
          <Card className="bg-white xl:sticky xl:top-6">
            <CardHeader>
              <CardTitle className="text-lg">Workflow summary</CardTitle>
              <CardDescription>
                Review what is ready before you save.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border bg-white p-4 ${
                    item.ready ? "border-primary/20" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-xl border bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Geofencing</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formData.geofence_enabled
                        ? "Users must be inside the selected location to complete the workflow."
                        : "Users can complete the workflow without location enforcement."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
