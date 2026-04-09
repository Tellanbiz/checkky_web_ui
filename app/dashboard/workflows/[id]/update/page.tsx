"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { getWorkflowById, getWorkflowMembers } from "@/lib/services/workflows/get";
import { useAvailableChecklistsForWorkflows } from "@/lib/services/workflows/hooks";
import { WorkflowParams } from "@/lib/services/workflows/models";
import { updateWorkflow } from "@/lib/services/workflows/update";
import { BasicInfoForm } from "@/components/workflow/forms/basic-info-form";
import { ChecklistTableForm } from "@/components/workflow/forms/checklist-table-form";
import { GeofencingForm } from "@/components/workflow/forms/geofencing-form";
import { LocationTableForm } from "@/components/workflow/forms/location-table-form";
import { MembersTableForm } from "@/components/workflow/forms/members-table-form";
import { ScheduleForm } from "@/components/workflow/forms/schedule-form";
import { WorkflowEditorShell } from "@/components/workflow/workflow-editor-shell";
import {
  DEFAULT_WORKFLOW_TIME,
  parseWorkflowScheduleConfig,
  serializeWorkflowScheduleConfig,
} from "@/lib/workflow-schedule";

export default function UpdateWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadWorkflowData = async () => {
      if (!params.id) return;

      try {
        const [workflowData, workflowMembers] = await Promise.all([
          getWorkflowById(params.id as string),
          getWorkflowMembers(params.id as string),
        ]);
        const scheduleConfig = parseWorkflowScheduleConfig(
          workflowData.scheduled_time,
        );

        setFormData({
          title: workflowData.title,
          notes: workflowData.notes,
          priority: workflowData.priority,
          checklist_id: workflowData.checklist_id,
          schedule_type: workflowData.schedule_type,
          scheduled_time: workflowData.scheduled_time,
          scheduled_times: scheduleConfig.times,
          reminder_minutes: scheduleConfig.reminderMinutes,
          day_of_week: workflowData.day_of_week ?? 1,
          day_of_month: workflowData.day_of_month,
          month: workflowData.month,
          geofence_enabled: true,
          timezone: workflowData.timezone,
          section_id: workflowData.section.id,
          members: workflowMembers.map((member) => member.id),
        });

        setWorkflowName(workflowData.title);
        setWorkflowDescription(workflowData.notes);
        setWorkflowPriority(workflowData.priority);
      } catch (error) {
        console.error("Failed to load workflow data:", error);
        toast({
          title: "Error",
          description: "Failed to load workflow data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflowData();
  }, [params.id, toast]);

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

    try {
      await updateWorkflow(params.id as string, {
        ...formData,
        title: workflowName,
        notes: workflowDescription,
        priority: workflowPriority,
      });

      toast({
        title: "Workflow Updated",
        description: `Your workflow "${workflowName}" has been updated.`,
      });

      router.push(`/dashboard/workflows/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  if (isLoading) {
    return (
      <WorkflowEditorShell
        title="Update Workflow"
        description="Review the existing workflow settings and adjust the parts that should change."
        submitLabel="Update workflow"
        submittingLabel="Updating workflow..."
        onSubmit={() => handleSubmit()}
        onCancel={() => router.push(`/dashboard/workflows/${params.id}`)}
        isSubmitting={false}
        submitDisabled={true}
        workflowName={workflowName}
        formData={formData}
      >
        <div className="rounded-3xl border border-[#d9decf] bg-white p-6 text-sm text-[#536250] shadow-sm">
          Loading workflow data...
        </div>
      </WorkflowEditorShell>
    );
  }

  if (checklistsError) {
    return (
      <WorkflowEditorShell
        title="Update Workflow"
        description="Review the existing workflow settings and adjust the parts that should change."
        submitLabel="Update workflow"
        submittingLabel="Updating workflow..."
        onSubmit={() => handleSubmit()}
        onCancel={() => router.push(`/dashboard/workflows/${params.id}`)}
        isSubmitting={false}
        submitDisabled={true}
        workflowName={workflowName}
        formData={formData}
      >
        <div className="rounded-3xl border border-red-200 bg-white p-6 text-sm text-red-600 shadow-sm">
          Failed to load available checklists. Please try again.
        </div>
      </WorkflowEditorShell>
    );
  }

  return (
    <WorkflowEditorShell
      title="Update Workflow"
      description="Keep the workflow setup readable by adjusting the essentials in one place and checking the live summary before saving."
      submitLabel="Update workflow"
      submittingLabel="Updating workflow..."
      onSubmit={() => handleSubmit()}
      onCancel={() => router.push(`/dashboard/workflows/${params.id}`)}
      isSubmitting={isSubmitting}
      submitDisabled={
        isSubmitting ||
        !workflowName ||
        !formData.checklist_id ||
        !formData.section_id ||
        formData.members.length === 0 ||
        checklistsLoading
      }
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
