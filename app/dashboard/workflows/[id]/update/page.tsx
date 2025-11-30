"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkflowParams } from "@/lib/services/workflows/models";
import { useAvailableChecklistsForWorkflows } from "@/lib/services/workflows/hooks";
import { getWorkflowById } from "@/lib/services/workflows/get";
import { BasicInfoForm } from "@/components/workflow/forms/basic-info-form";
import { ChecklistTableForm } from "@/components/workflow/forms/checklist-table-form";
import { ScheduleForm } from "@/components/workflow/forms/schedule-form";
import { LocationTableForm } from "@/components/workflow/forms/location-table-form";
import { GeofencingForm } from "@/components/workflow/forms/geofencing-form";
import { MembersTableForm } from "@/components/workflow/forms/members-table-form";
import { updateWorkflow } from "@/lib/services/workflows/update";

export default function UpdateWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available checklists using TanStack Query
  const {
    data: availableChecklists = [],
    isLoading: checklistsLoading,
    error: checklistsError,
  } = useAvailableChecklistsForWorkflows();

  // Form state
  const [formData, setFormData] = useState<WorkflowParams>({
    title: "",
    notes: "",
    priority: "low",
    checklist_id: "",
    schedule_type: "daily",
    scheduled_time: "09:00AM",
    day_of_month: 1,
    month: 1,
    geofence_enabled: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    section_id: "",
    members: [],
  });

  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowPriority, setWorkflowPriority] = useState<
    "low" | "mid" | "high"
  >("low");

  // Load existing workflow data
  useEffect(() => {
    const loadWorkflowData = async () => {
      if (!params.id) return;

      try {
        const workflowData = await getWorkflowById(params.id as string);

        // Set form data with existing values
        setFormData({
          title: workflowData.title,
          notes: workflowData.notes,
          priority: workflowData.priority,
          checklist_id: workflowData.checklist_id,
          schedule_type: workflowData.schedule_type,
          scheduled_time: workflowData.scheduled_time,
          day_of_month: workflowData.day_of_month,
          month: workflowData.month,
          geofence_enabled: true, // Default value, might need to be added to WorkspaceInfo
          timezone: workflowData.timezone,
          section_id: workflowData.section.id,
          members: [], // Will need to fetch members separately
        });

        // Set local state
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (
      !workflowName ||
      !formData.checklist_id ||
      !formData.section_id ||
      formData.members.length === 0
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please fill in all required fields and select at least one team member.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update workflow using the service function
      await updateWorkflow(params.id as string, {
        ...formData,
        title: workflowName,
        notes: workflowDescription,
        priority: workflowPriority,
      });

      toast({
        title: "Workflow Updated Successfully!",
        description: `Your workflow "${workflowName}" has been updated successfully.`,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading workflow data...</p>
        </div>
      </div>
    );
  }

  if (checklistsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Checklists
          </h3>
          <p className="text-sm text-red-600">
            Failed to load available checklists. Please try again.
          </p>
          <Button
            onClick={() => router.push(`/dashboard/workflows/${params.id}`)}
            className="mt-4"
          >
            Back to Workflow
          </Button>
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
                Update Workflow
              </h1>
            </div>
            <Button
              onClick={() => handleSubmit()}
              disabled={
                isSubmitting ||
                !workflowName ||
                !formData.checklist_id ||
                !formData.section_id ||
                formData.members.length === 0 ||
                checklistsLoading
              }
              className="px-4 py-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Workflow"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <BasicInfoForm
            workflowName={workflowName}
            workflowDescription={workflowDescription}
            onNameChange={setWorkflowName}
            onDescriptionChange={setWorkflowDescription}
          />

          {/* Checklist Selection */}
          <ChecklistTableForm
            selectedChecklistId={formData.checklist_id}
            onChecklistChange={(value) =>
              handleFormDataChange({ checklist_id: value })
            }
          />

          {/* Schedule Configuration */}
          <ScheduleForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />

          {/* Location Assignment */}
          <LocationTableForm
            selectedSectionId={formData.section_id}
            onSectionChange={(value) =>
              handleFormDataChange({ section_id: value })
            }
          />

          {/* Geofencing Requirements */}
          <GeofencingForm
            geofencing={formData.geofence_enabled}
            onGeofencingChange={(value) =>
              handleFormDataChange({ geofence_enabled: value })
            }
          />

          {/* Team Member Assignment */}
          <MembersTableForm
            selectedMemberIds={formData.members}
            onMemberToggle={handleMemberToggle}
          />

          {/* Info Section */}
          {/* Removed - tips are now integrated into each form container */}
        </form>
      </div>
    </div>
  );
}
