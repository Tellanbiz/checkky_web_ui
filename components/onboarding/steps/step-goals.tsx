import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/onboarding/tag-input";
import { StepField } from "@/components/onboarding/step-field";
import { SelectField } from "@/components/onboarding/select-field";
import { MultiSelectGrid } from "@/components/onboarding/multi-select-grid";
import { SummaryStat } from "@/components/onboarding/summary-stat";
import {
  BUDGET_OPTIONS,
  FIELD_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
  TOP_PRIORITY_OPTIONS,
} from "@/lib/onboarding/options";
import type { StepProps } from "@/components/onboarding/types";
import { toggleItem } from "@/components/onboarding/types";

export function StepGoals({ form, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <StepField label="Top priority">
          <SelectField
            value={form.top_priority}
            onChange={(v) => updateField("top_priority", v)}
            placeholder="Select top priority"
            options={TOP_PRIORITY_OPTIONS}
          />
        </StepField>
        <StepField label="Success metrics">
          <Input
            value={form.success_metrics}
            onChange={(e) => updateField("success_metrics", e.target.value)}
            placeholder="Zero audit findings, faster reporting, better completion..."
            className="h-11 rounded-xl border-neutral-200"
          />
        </StepField>
        <StepField label="Implementation timeline">
          <SelectField
            value={form.timeline}
            onChange={(v) => updateField("timeline", v)}
            placeholder="Select timeline"
            options={TIMELINE_OPTIONS}
          />
        </StepField>
        <StepField label="Budget">
          <SelectField
            value={form.budget}
            onChange={(v) => updateField("budget", v)}
            placeholder="Select budget"
            options={BUDGET_OPTIONS}
          />
        </StepField>
      </div>

      <StepField label="Custom field types needed">
        <MultiSelectGrid
          options={FIELD_TYPE_OPTIONS}
          selected={form.custom_field_types}
          onToggle={(v) => updateField("custom_field_types", toggleItem(form.custom_field_types, v))}
          columns={3}
        />
      </StepField>

      <StepField label="Checklist names you want generated">
        <TagInput
          value={form.custom_checklist_names}
          onChange={(v) => updateField("custom_checklist_names", v)}
          placeholder="Add checklist names and press Enter"
        />
      </StepField>

      <div className="grid gap-5 md:grid-cols-2">
        <StepField label="Custom categories">
          <TagInput
            value={form.custom_categories}
            onChange={(v) => updateField("custom_categories", v)}
            placeholder="Add custom categories"
          />
        </StepField>
        <StepField label="Custom compliance standards">
          <TagInput
            value={form.custom_compliance_standards}
            onChange={(v) => updateField("custom_compliance_standards", v)}
            placeholder="Add standards"
          />
        </StepField>
      </div>

      <StepField label="Additional notes">
        <Textarea
          value={form.additional_notes}
          onChange={(e) => updateField("additional_notes", e.target.value)}
          placeholder="Anything else we should consider while setting up your workflows and checklists?"
          className="min-h-[132px] rounded-2xl border-neutral-200"
        />
      </StepField>

      <div className="space-y-4 rounded-3xl border border-neutral-200 bg-[#f7f8f4] p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#172014]">Submission summary</h2>
          <p className="mt-1 text-sm text-[#5f6757]">
            This is what will be used to tailor your checklist library, reminders, and workflow setup.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryStat label="Industry" value={form.industry || "Not set"} />
          <SummaryStat label="Organisation" value={form.org_name || "Not set"} />
          <SummaryStat
            label="Operations"
            value={`${form.operation_type.length + form.custom_operation_types.length} selected`}
          />
          <SummaryStat
            label="Checklist owners"
            value={`${form.who_completes_checklists.length} selected`}
          />
        </div>
      </div>
    </div>
  );
}
