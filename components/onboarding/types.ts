import type { SaveOnboardingParams } from "@/lib/services/accounts/models";

export interface StepProps {
  form: SaveOnboardingParams;
  updateField: <K extends keyof SaveOnboardingParams>(
    key: K,
    value: SaveOnboardingParams[K],
  ) => void;
}

export function toggleItem(items: string[], value: string) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}
