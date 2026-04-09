"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { createWorkflow } from "@/lib/services/workflows/post";
import { WorkflowParams } from "@/lib/services/workflows/models";
import { useAvailableChecklistsForWorkflows } from "@/lib/services/workflows/hooks";
import { BasicInfoForm } from "@/components/workflow/forms/basic-info-form";
import { ChecklistTableForm } from "@/components/workflow/forms/checklist-table-form";
import { GeofencingForm } from "@/components/workflow/forms/geofencing-form";
import { LocationTableForm } from "@/components/workflow/forms/location-table-form";
import { MembersTableForm } from "@/components/workflow/forms/members-table-form";
import { ScheduleForm } from "@/components/workflow/forms/schedule-form";
import { WorkflowEditorShell } from "@/components/workflow/workflow-editor-shell";
import {
  DEFAULT_WORKFLOW_TIME,
  serializeWorkflowScheduleConfig,
} from "@/lib/workflow-schedule";

export default function NewWorkflowPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { isLoading: checklistsLoading, error: checklistsError } =
    useAvailableChecklistsForWorkflows();

  const [formData, setFormData] = useState<WorkflowParams>({
    title: "",
    notes: "",
    priority: "low",
    checklist_id: "",
    schedule_type: "daily",
    scheduled_time: serializeWorkflowScheduleConfig([DEFAULT_WORKFLOW_TIME], 0),
    scheduled_times: [DEFAULT_WORKFLOW_TIME],
    reminder_minutes: 0,
    day_of_week: 1,
    day_of_month: 1,
    month: 1,
    geofence_enabled: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    section_id: "",
    members: [],
  });

  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowPriority, setWorkflowPriority] = useState<"low" | "mid" | "high">(
    "low",
  );

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (
      !workflowName ||
      !formData.checklist_id ||
      !formData.section_id ||
      formData.members.length === 0
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please fill in the workflow name, checklist, location, and assign at least one team member.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const progressSteps = [
        { progress: 20, delay: 250 },
        { progress: 45, delay: 300 },
        { progress: 70, delay: 250 },
        { progress: 90, delay: 200 },
      ];

      for (const step of progressSteps) {
        await new Promise((resolve) => {
          setTimeout(() => {
            setUploadProgress(step.progress);
            resolve(undefined);
          }, step.delay);
        });
      }

      await createWorkflow({
        ...formData,
        title: workflowName,
        notes: workflowDescription,
        priority: workflowPriority,
      });

      setUploadProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 200));

      toast({
        title: "Workflow Created",
        description: `Your workflow "${workflowName}" is ready and scheduled.`,
      });

      router.push("/dashboard/workflows");
    } catch (error) {
      console.error("Workflow creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }));
  };

  const handleFormDataChange = (updates: Partial<WorkflowParams>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  if (checklistsError) {
    return (
      <WorkflowEditorShell
        title="Create Workflow"
        description="Set up a workflow with its checklist, schedule, location, and assignees."
        submitLabel="Create workflow"
        submittingLabel="Creating workflow..."
        onSubmit={() => handleSubmit()}
        onCancel={() => router.push("/dashboard/workflows")}
        isSubmitting={false}
        submitDisabled={true}
        workflowName={workflowName}
        formData={formData}
      >
        <div className="rounded-3xl border border-red-200 bg-white p-6 text-sm text-red-600 shadow-sm">
          Failed to load available checklists. Please go back and try again.
        </div>
      </WorkflowEditorShell>
    );
  }

  return (
    <WorkflowEditorShell
      title="Create Workflow"
      description="Build the workflow in order: name it, choose the checklist, decide when it should run, then assign the location and people."
      submitLabel="Create workflow"
      submittingLabel="Creating workflow..."
      onSubmit={() => handleSubmit()}
      onCancel={() => router.push("/dashboard/workflows")}
      isSubmitting={isSubmitting}
      submitDisabled={
        isSubmitting ||
        !workflowName ||
        !formData.checklist_id ||
        !formData.section_id ||
        formData.members.length === 0 ||
        checklistsLoading
      }
      uploadProgress={uploadProgress}
      workflowName={workflowName}
      formData={{
        ...formData,
        title: workflowName,
        notes: workflowDescription,
        priority: workflowPriority,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoForm
          workflowName={workflowName}
          workflowDescription={workflowDescription}
          onNameChange={setWorkflowName}
          onDescriptionChange={setWorkflowDescription}
        />

        <ChecklistTableForm
          selectedChecklistId={formData.checklist_id}
          onChecklistChange={(value) =>
            handleFormDataChange({ checklist_id: value })
          }
        />

        <ScheduleForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />

        <LocationTableForm
          selectedSectionId={formData.section_id}
          onSectionChange={(value) =>
            handleFormDataChange({ section_id: value })
          }
        />

        <GeofencingForm
          geofencing={formData.geofence_enabled}
          onGeofencingChange={(value) =>
            handleFormDataChange({ geofence_enabled: value })
          }
        />

        <MembersTableForm
          selectedMemberIds={formData.members}
          onMemberToggle={handleMemberToggle}
        />
      </form>
    </WorkflowEditorShell>
  );
}
