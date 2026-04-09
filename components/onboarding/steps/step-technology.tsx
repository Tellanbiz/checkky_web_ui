import { Input } from "@/components/ui/input";
import { StepField } from "@/components/onboarding/step-field";
import { SelectField } from "@/components/onboarding/select-field";
import { MultiSelectGrid } from "@/components/onboarding/multi-select-grid";
import {
  CONNECTIVITY_OPTIONS,
  DEVICE_OPTIONS,
  INTEGRATION_OPTIONS,
  PHOTO_REQUIRED_OPTIONS,
} from "@/lib/onboarding/options";
import type { StepProps } from "@/components/onboarding/types";
import { toggleItem } from "@/components/onboarding/types";

export function StepTechnology({ form, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <StepField label="Devices used in the field">
        <MultiSelectGrid
          options={DEVICE_OPTIONS}
          selected={form.devices_used}
          onToggle={(v) => updateField("devices_used", toggleItem(form.devices_used, v))}
        />
      </StepField>

      <div className="grid gap-5 md:grid-cols-2">
        <StepField label="Connectivity" required>
          <SelectField
            value={form.connectivity}
            onChange={(v) => updateField("connectivity", v)}
            placeholder="Select connectivity"
            options={CONNECTIVITY_OPTIONS}
          />
        </StepField>
        <StepField label="Photo documentation required" required>
          <SelectField
            value={form.photo_required}
            onChange={(v) => updateField("photo_required", v)}
            placeholder="Select requirement"
            options={PHOTO_REQUIRED_OPTIONS}
          />
        </StepField>
      </div>

      <StepField label="Existing tools or systems">
        <Input
          value={form.existing_tools}
          onChange={(e) => updateField("existing_tools", e.target.value)}
          placeholder="SAP, Microsoft 365, paper-based, Salesforce..."
          className="h-11 rounded-xl border-neutral-200"
        />
      </StepField>

      <StepField label="Integrations needed">
        <MultiSelectGrid
          options={INTEGRATION_OPTIONS}
          selected={form.integrations_needed}
          onToggle={(v) =>
            updateField("integrations_needed", toggleItem(form.integrations_needed, v))
          }
        />
      </StepField>
    </div>
  );
}
