import { StepField } from "@/components/onboarding/step-field";
import { SelectField } from "@/components/onboarding/select-field";
import { MultiSelectGrid } from "@/components/onboarding/multi-select-grid";
import {
  SHIFT_STRUCTURE_OPTIONS,
  TOTAL_STAFF_OPTIONS,
} from "@/lib/onboarding/options";
import type { StepProps } from "@/components/onboarding/types";
import { toggleItem } from "@/components/onboarding/types";

interface StepWorkforceProps extends StepProps {
  staffRoles: string[];
  checklistOwners: string[];
}

export function StepWorkforce({ form, updateField, staffRoles, checklistOwners }: StepWorkforceProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <StepField label="Total staff">
          <SelectField
            value={form.total_staff}
            onChange={(v) => updateField("total_staff", v)}
            placeholder="Select staff count"
            options={TOTAL_STAFF_OPTIONS}
          />
        </StepField>
        <StepField label="Shift structure">
          <SelectField
            value={form.shift_structure}
            onChange={(v) => updateField("shift_structure", v)}
            placeholder="Select shift structure"
            options={SHIFT_STRUCTURE_OPTIONS}
          />
        </StepField>
      </div>

      <StepField label="Staff roles">
        <MultiSelectGrid
          options={staffRoles}
          selected={form.staff_roles}
          onToggle={(v) => updateField("staff_roles", toggleItem(form.staff_roles, v))}
        />
      </StepField>

      <StepField label="Who completes checklists" hint="Use this to decide assignments and reminders.">
        <MultiSelectGrid
          options={checklistOwners}
          selected={form.who_completes_checklists}
          onToggle={(v) =>
            updateField("who_completes_checklists", toggleItem(form.who_completes_checklists, v))
          }
        />
      </StepField>
    </div>
  );
}
