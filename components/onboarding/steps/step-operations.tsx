import { TagInput } from "@/components/onboarding/tag-input";
import { StepField } from "@/components/onboarding/step-field";
import { SelectField } from "@/components/onboarding/select-field";
import { MultiSelectGrid } from "@/components/onboarding/multi-select-grid";
import { OPERATION_SCALE_OPTIONS } from "@/lib/onboarding/options";
import type { StepProps } from "@/components/onboarding/types";
import { toggleItem } from "@/components/onboarding/types";

interface StepOperationsProps extends StepProps {
  profile: {
    operationTypes: string[];
    equipment: string[];
    facilities: string[];
  };
}

export function StepOperations({ form, updateField, profile }: StepOperationsProps) {
  return (
    <div className="space-y-8">
      <StepField label="Operation types" hint="Choose the core activities you run." required>
        <MultiSelectGrid
          options={profile.operationTypes}
          selected={form.operation_type}
          onToggle={(v) => updateField("operation_type", toggleItem(form.operation_type, v))}
        />
      </StepField>

      <StepField label="Custom operation types" hint="Add any operation types not covered above.">
        <TagInput
          value={form.custom_operation_types}
          onChange={(v) => updateField("custom_operation_types", v)}
          placeholder="Add custom operation types and press Enter"
        />
      </StepField>

      <StepField label="Equipment used">
        <MultiSelectGrid
          options={profile.equipment}
          selected={form.equipment_used}
          onToggle={(v) => updateField("equipment_used", toggleItem(form.equipment_used, v))}
        />
      </StepField>

      <StepField label="Facilities or work areas">
        <MultiSelectGrid
          options={profile.facilities}
          selected={form.facilities}
          onToggle={(v) => updateField("facilities", toggleItem(form.facilities, v))}
        />
      </StepField>

      <div className="grid gap-5 md:grid-cols-2">
        <StepField label="Products, crops, or services">
          <TagInput
            value={form.crops_or_products}
            onChange={(v) => updateField("crops_or_products", v)}
            placeholder="Add products or services and press Enter"
          />
        </StepField>
        <StepField label="Operation scale">
          <SelectField
            value={form.operation_scale}
            onChange={(v) => updateField("operation_scale", v)}
            placeholder="Select operation scale"
            options={OPERATION_SCALE_OPTIONS}
          />
        </StepField>
      </div>
    </div>
  );
}
