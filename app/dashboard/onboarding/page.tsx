"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { getIndustryProfile } from "@/lib/onboarding/options";
import type { SaveOnboardingParams } from "@/lib/services/accounts/models";
import { getOnboardingProfile } from "@/lib/services/accounts/services-get";
import { saveOnboardingProfile } from "@/lib/services/accounts/services-post";
import { cn } from "@/lib/utils";

import { StepTeam } from "@/components/onboarding/steps/step-team";
import { StepOperations } from "@/components/onboarding/steps/step-operations";
import { StepCompliance } from "@/components/onboarding/steps/step-compliance";
import { StepWorkforce } from "@/components/onboarding/steps/step-workforce";
import { StepTechnology } from "@/components/onboarding/steps/step-technology";
import { StepGoals } from "@/components/onboarding/steps/step-goals";

const TOTAL_STEPS = 6;

const STEP_META = [
  {
    title: "Tell Us About Your Team",
    description:
      "We start with your organisation, role, and contact details so the rest of onboarding is tailored correctly.",
  },
  {
    title: "Map Your Operations",
    description:
      "Choose the types of work, equipment, and facilities involved in your day-to-day operations.",
  },
  {
    title: "Compliance & Safety",
    description:
      "Show us your gaps, compliance obligations, and the issues you need the platform to help reduce.",
  },
  {
    title: "Workforce & Ownership",
    description:
      "Define who is on the ground, who owns checklists, and how work changes across shifts.",
  },
  {
    title: "Technology & Evidence",
    description:
      "Tell us what devices, systems, and connectivity your team already works with.",
  },
  {
    title: "Goals & Checklist Setup",
    description:
      "Finish with priorities, rollout timing, and the custom checklist ideas you want us to prepare for you.",
  },
] as const;

const EMPTY_FORM: SaveOnboardingParams = {
  org_name: "",
  country: "",
  location: "",
  team_members: "",
  industry: "",
  position: "",
  operation_type: [],
  custom_operation_types: [],
  equipment_used: [],
  facilities: [],
  crops_or_products: [],
  operation_scale: "",
  pain_points: [],
  compliance_requirements: [],
  documentation_gaps: [],
  incident_history: "",
  total_staff: "",
  staff_roles: [],
  who_completes_checklists: [],
  shift_structure: "",
  devices_used: [],
  connectivity: "",
  existing_tools: "",
  integrations_needed: [],
  photo_required: "",
  top_priority: "",
  timeline: "",
  budget: "",
  success_metrics: "",
  custom_categories: [],
  custom_field_types: [],
  custom_compliance_standards: [],
  custom_checklist_names: [],
  additional_notes: "",
  contact_name: "",
  contact_role: "",
  contact_email: "",
  contact_phone: "",
  complete: false,
};

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<SaveOnboardingParams>(EMPTY_FORM);
  const [hydrated, setHydrated] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["account-onboarding"],
    queryFn: getOnboardingProfile,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!data || hydrated) return;
    setForm({
      org_name: data.org_name,
      country: data.country,
      location: data.location,
      team_members: data.team_members,
      industry: data.industry,
      position: data.position,
      operation_type: data.operation_type,
      custom_operation_types: data.custom_operation_types,
      equipment_used: data.equipment_used,
      facilities: data.facilities,
      crops_or_products: data.crops_or_products,
      operation_scale: data.operation_scale,
      pain_points: data.pain_points,
      compliance_requirements: data.compliance_requirements,
      documentation_gaps: data.documentation_gaps,
      incident_history: data.incident_history,
      total_staff: data.total_staff,
      staff_roles: data.staff_roles,
      who_completes_checklists: data.who_completes_checklists,
      shift_structure: data.shift_structure,
      devices_used: data.devices_used,
      connectivity: data.connectivity,
      existing_tools: data.existing_tools,
      integrations_needed: data.integrations_needed,
      photo_required: data.photo_required,
      top_priority: data.top_priority,
      timeline: data.timeline,
      budget: data.budget,
      success_metrics: data.success_metrics,
      custom_categories: data.custom_categories,
      custom_field_types: data.custom_field_types,
      custom_compliance_standards: data.custom_compliance_standards,
      custom_checklist_names: data.custom_checklist_names,
      additional_notes: data.additional_notes,
      contact_name: data.contact_name,
      contact_role: data.contact_role,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      complete: false,
    });
    setHydrated(true);
  }, [data, hydrated]);

  const profile = useMemo(
    () => getIndustryProfile(form.industry),
    [form.industry],
  );

  const checklistOwners = useMemo(() => {
    if (form.staff_roles.length > 0) return form.staff_roles;
    return profile.staffRoles;
  }, [form.staff_roles, profile.staffRoles]);

  const saveMutation = useMutation({
    mutationFn: (payload: SaveOnboardingParams) =>
      saveOnboardingProfile(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["account-onboarding"] });
      toast({
        title: payload.complete ? "Onboarding completed" : "Draft saved",
        description: payload.complete
          ? "Your onboarding details have been saved and your dashboard is ready."
          : "Your onboarding progress has been saved.",
      });
      if (payload.complete) router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to save onboarding",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateField = <K extends keyof SaveOnboardingParams>(
    key: K,
    value: SaveOnboardingParams[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !form.org_name ||
        !form.country ||
        !form.industry ||
        !form.position ||
        !form.team_members ||
        !form.contact_name ||
        !form.contact_role ||
        !form.contact_email
      ) {
        return "Add your organisation, country, role, team size, and full contact details before continuing.";
      }
      if (!emailPattern.test(form.contact_email.trim())) {
        return "Enter a valid contact email before continuing.";
      }
    }
    if (step === 2) {
      if (
        form.operation_type.length === 0 &&
        form.custom_operation_types.length === 0
      ) {
        return "Choose at least one operation type for your workflow setup.";
      }
    }
    if (step === 5) {
      if (!form.connectivity || !form.photo_required) {
        return "Choose your connectivity level and whether photo evidence is required.";
      }
    }
    return "";
  };

  const handleNext = () => {
    const message = validateStep(currentStep);
    if (message) {
      toast({
        title: "Finish this step",
        description: message,
        variant: "destructive",
      });
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleSave = (complete: boolean) => {
    if (complete) {
      for (let step = 1; step <= TOTAL_STEPS; step += 1) {
        const message = validateStep(step);
        if (message) {
          setCurrentStep(step);
          toast({
            title: "Onboarding is incomplete",
            description: message,
            variant: "destructive",
          });
          return;
        }
      }
    }
    saveMutation.mutate({ ...form, complete });
  };

  if (isLoading && !hydrated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f7f8f4]">
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading onboarding...
        </div>
      </div>
    );
  }

  const progressValue = Math.round((currentStep / TOTAL_STEPS) * 100);
  const activeStep = STEP_META[currentStep - 1];
  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <div className="min-h-full bg-white px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[28px] border border-[#d9decf] bg-white p-6 shadow-sm md:p-8">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#172014]">
                {activeStep.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6757]">
                {activeStep.description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <Progress
                value={progressValue}
                className="h-2 flex-1 bg-neutral-100 [&>div]:bg-[#183a1d]"
              />
              <span className="text-xs font-medium text-[#6b7562] whitespace-nowrap">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
            </div>
          </div>

          {/* Step content */}
          <div className="mt-8 space-y-8">
            {currentStep === 1 && (
              <StepTeam form={form} updateField={updateField} />
            )}
            {currentStep === 2 && (
              <StepOperations
                form={form}
                updateField={updateField}
                profile={profile}
              />
            )}
            {currentStep === 3 && (
              <StepCompliance
                form={form}
                updateField={updateField}
                compliance={profile.compliance}
              />
            )}
            {currentStep === 4 && (
              <StepWorkforce
                form={form}
                updateField={updateField}
                staffRoles={profile.staffRoles}
                checklistOwners={checklistOwners}
              />
            )}
            {currentStep === 5 && (
              <StepTechnology form={form} updateField={updateField} />
            )}
            {currentStep === 6 && (
              <StepGoals form={form} updateField={updateField} />
            )}
          </div>

          {/* Footer navigation */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-neutral-200"
              onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
              disabled={currentStep === 1}
            >
              Back
            </Button>

            <div className="flex flex-wrap items-center gap-3">
              {!isLastStep && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl border-neutral-200"
                  onClick={() => handleSave(false)}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save draft
                </Button>
              )}

              {isLastStep ? (
                <Button
                  type="button"
                  className="h-10 rounded-xl bg-[#183a1d] px-6 text-white hover:bg-[#122c16]"
                  onClick={() => handleSave(true)}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save and finish onboarding
                </Button>
              ) : (
                <Button
                  type="button"
                  className="h-10 rounded-xl bg-[#183a1d] px-6 text-white hover:bg-[#122c16]"
                  onClick={handleNext}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
