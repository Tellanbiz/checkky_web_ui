"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkflowParams, ScheduleType } from "@/lib/services/workflows/models";
import { useAvailableChecklistsForWorkflows } from "@/lib/services/workflows/hooks";
import { BasicInfoForm } from "@/components/workflow/forms/basic-info-form";
import { ChecklistSelectForm } from "@/components/workflow/forms/checklist-select-form";
import { ScheduleForm } from "@/components/workflow/forms/schedule-form";
import { LocationForm } from "@/components/workflow/forms/location-form";
import { MemberAssignmentForm } from "@/components/workflow/forms/member-assignment-form";
import { InfoSection } from "@/components/workflow/forms/info-section";

export default function NewWorkflowPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available checklists using TanStack Query
  const { data: availableChecklists = [], isLoading: checklistsLoading, error: checklistsError } = useAvailableChecklistsForWorkflows();

  // Form state
  const [formData, setFormData] = useState<WorkflowParams>({
    ChecklistID: "",
    ScheduledTime: "09:00:00",
    ScheduleType: "daily",
    DayOfWeek: 1, // Monday
    DayOfMonth: 1,
    Month: 1,
    Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    SectionID: "",
    MemberIDs: [],
  });

  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");

  // Mock data - in real app, these would come from API
  const availableSections = [
    { id: "1", name: "Production Area A", description: "Main production floor" },
    { id: "2", name: "Warehouse Section", description: "Storage and inventory area" },
    { id: "3", name: "Office Complex", description: "Administrative areas" },
  ];

  const availableMembers = [
    { id: "1", name: "John Smith", role: "Safety Officer" },
    { id: "2", name: "Sarah Johnson", role: "Quality Manager" },
    { id: "3", name: "Mike Wilson", role: "Maintenance Lead" },
    { id: "4", name: "Emma Davis", role: "Production Supervisor" },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!formData.ChecklistID || !formData.SectionID || formData.MemberIDs.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one team member.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          name: workflowName,
          description: workflowDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create workflow');
      }

      toast({
        title: "Workflow Created Successfully!",
        description: `Your workflow "${workflowName}" has been set up and will start running automatically.`,
      });

      router.push('/dashboard/workflows');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      MemberIDs: prev.MemberIDs.includes(memberId)
        ? prev.MemberIDs.filter(id => id !== memberId)
        : [...prev.MemberIDs, memberId]
    }));
  };

  const handleFormDataChange = (updates: Partial<WorkflowParams>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
          <p className="text-sm text-red-600">Failed to load available checklists. Please try again.</p>
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
              disabled={isSubmitting || !workflowName || !formData.ChecklistID || !formData.SectionID || formData.MemberIDs.length === 0 || checklistsLoading}
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
          <ChecklistSelectForm
            selectedChecklistId={formData.ChecklistID}
            availableChecklists={availableChecklists}
            onChecklistChange={(value) => handleFormDataChange({ ChecklistID: value })}
          />

          {/* Schedule Configuration */}
          <ScheduleForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />

          {/* Location Assignment */}
          <LocationForm
            selectedSectionId={formData.SectionID}
            availableSections={availableSections}
            onSectionChange={(value) => handleFormDataChange({ SectionID: value })}
          />

          {/* Team Member Assignment */}
          <MemberAssignmentForm
            selectedMemberIds={formData.MemberIDs}
            onMemberToggle={handleMemberToggle}
          />

          {/* Info Section */}
          {/* Removed - tips are now integrated into each form container */}

          
        </form>
        </div>
      </div>
   
  );
}