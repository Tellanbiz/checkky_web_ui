import { Label } from "@/components/ui/label";

export function StepField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 bg-white">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-sm font-semibold text-[#172014]">
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </Label>
        {hint ? <span className="text-xs text-[#6a7363]">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}
