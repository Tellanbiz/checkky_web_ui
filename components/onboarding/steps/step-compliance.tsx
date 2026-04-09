import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/onboarding/tag-input";
import { StepField } from "@/components/onboarding/step-field";
import { MultiSelectGrid } from "@/components/onboarding/multi-select-grid";
import { PAIN_POINTS } from "@/lib/onboarding/options";
import type { StepProps } from "@/components/onboarding/types";
import { toggleItem } from "@/components/onboarding/types";

interface StepComplianceProps extends StepProps {
  compliance: string[];
}

export function StepCompliance({ form, updateField, compliance }: StepComplianceProps) {
  return (
    <div className="space-y-8">
      <StepField label="Current pain points" hint="Select the problems you want to eliminate first.">
        <MultiSelectGrid
          options={PAIN_POINTS}
          selected={form.pain_points}
          onToggle={(v) => updateField("pain_points", toggleItem(form.pain_points, v))}
        />
      </StepField>

      <StepField label="Compliance requirements">
        <MultiSelectGrid
          options={compliance}
          selected={form.compliance_requirements}
          onToggle={(v) =>
            updateField("compliance_requirements", toggleItem(form.compliance_requirements, v))
          }
        />
      </StepField>

      <StepField label="Current documentation gaps">
        <TagInput
          value={form.documentation_gaps}
          onChange={(v) => updateField("documentation_gaps", v)}
          placeholder="Add documentation issues and press Enter"
        />
      </StepField>

      <StepField label="Incident history">
        <Textarea
          value={form.incident_history}
          onChange={(e) => updateField("incident_history", e.target.value)}
          placeholder="Any recurring incidents, audit findings, or compliance issues we should account for?"
          className="min-h-[132px] rounded-2xl border-neutral-200"
        />
      </StepField>
    </div>
  );
}
