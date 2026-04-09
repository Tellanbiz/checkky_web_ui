import { Input } from "@/components/ui/input";
import { StepField } from "@/components/onboarding/step-field";
import { SelectField } from "@/components/onboarding/select-field";
import {
  COUNTRY_OPTIONS,
  INDUSTRIES,
  POSITION_OPTIONS,
  TEAM_MEMBER_OPTIONS,
} from "@/lib/onboarding/options";
import type { StepProps } from "@/components/onboarding/types";

export function StepTeam({ form, updateField }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <StepField label="Organisation name" required>
          <Input
            value={form.org_name}
            onChange={(e) => updateField("org_name", e.target.value)}
            placeholder="Your company or operation name"
            className="h-11 rounded-xl border-neutral-200"
          />
        </StepField>
        <StepField label="Country" required>
          <SelectField
            value={form.country}
            onChange={(v) => updateField("country", v)}
            placeholder="Select country"
            options={COUNTRY_OPTIONS}
          />
        </StepField>
        <StepField label="Location">
          <Input
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="City, region, or main site"
            className="h-11 rounded-xl border-neutral-200"
          />
        </StepField>
        <StepField label="Industry" required>
          <SelectField
            value={form.industry}
            onChange={(v) => updateField("industry", v)}
            placeholder="Select industry"
            options={INDUSTRIES}
          />
        </StepField>
        <StepField label="Your position">
          <SelectField
            value={form.position}
            onChange={(v) => updateField("position", v)}
            placeholder="Select position"
            options={POSITION_OPTIONS}
          />
        </StepField>
        <StepField label="Team size">
          <SelectField
            value={form.team_members}
            onChange={(v) => updateField("team_members", v)}
            placeholder="Select team size"
            options={TEAM_MEMBER_OPTIONS}
          />
        </StepField>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#172014]">Primary contact</h2>
          <p className="mt-1 text-sm text-[#5f6757]">
            This helps us know who owns the rollout and who should receive checklist setup follow-up.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <StepField label="Contact name" required>
            <Input
              value={form.contact_name}
              onChange={(e) => updateField("contact_name", e.target.value)}
              placeholder="Full name"
              className="h-11 rounded-xl border-neutral-200 bg-white"
            />
          </StepField>
          <StepField label="Contact role">
            <Input
              value={form.contact_role}
              onChange={(e) => updateField("contact_role", e.target.value)}
              placeholder="Operations lead, manager, founder..."
              className="h-11 rounded-xl border-neutral-200 bg-white"
            />
          </StepField>
          <StepField label="Contact email" required>
            <Input
              value={form.contact_email}
              onChange={(e) => updateField("contact_email", e.target.value)}
              placeholder="name@company.com"
              className="h-11 rounded-xl border-neutral-200 bg-white"
            />
          </StepField>
          <StepField label="Contact phone">
            <Input
              value={form.contact_phone}
              onChange={(e) => updateField("contact_phone", e.target.value)}
              placeholder="+254..."
              className="h-11 rounded-xl border-neutral-200 bg-white"
            />
          </StepField>
        </div>
      </div>
    </div>
  );
}
