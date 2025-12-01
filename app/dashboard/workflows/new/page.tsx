"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkflowParams } from "@/lib/services/workflows/models";
import { useAvailableChecklistsForWorkflows } from "@/lib/services/workflows/hooks";
import { createWorkflow } from "@/lib/services/workflows/post";
import { BasicInfoForm } from "@/components/workflow/forms/basic-info-form";
import { ChecklistTableForm } from "@/components/workflow/forms/checklist-table-form";
import { ScheduleForm } from "@/components/workflow/forms/schedule-form";
import { LocationTableForm } from "@/components/workflow/forms/location-table-form";
import { GeofencingForm } from "@/components/workflow/forms/geofencing-form";
import { MembersTableForm } from "@/components/workflow/forms/members-table-form";

export default function NewWorkflowPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    scheduled_time: "9:00AM",
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
    setUploadProgress(0);

    try {
      // Simulate progress steps for workflow creation
      const progressSteps = [
        { progress: 20, delay: 300 },
        { progress: 40, delay: 500 },
        { progress: 60, delay: 400 },
        { progress: 80, delay: 300 },
        { progress: 95, delay: 200 },
      ];

      // Execute progress steps
      for (const step of progressSteps) {
        await new Promise(resolve => {
          setTimeout(() => {
            setUploadProgress(step.progress);
            resolve(undefined);
          }, step.delay);
        });
      }

      // Create workflow using the service function
      await createWorkflow({
        ...formData,
        title: workflowName,
        notes: workflowDescription,
        priority: workflowPriority,
      });

      // Complete progress
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 200));

      toast({
        title: "Workflow Created Successfully!",
        description: `Your workflow "${workflowName}" has been set up and will start running automatically.`,
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
            onClick={() => router.push("/dashboard/workflows")}
            className="mt-4"
          >
            Back to Workflows
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
                Create New Workflow
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
                  Creating...
                </>
              ) : (
                "Create Workflow"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar - Show only when submitting */}
      {isSubmitting && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Creating workflow...</span>
                <span className="text-gray-900 font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        </div>
      )}

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
