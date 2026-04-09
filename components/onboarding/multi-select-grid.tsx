import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function MultiSelectGrid({
  options,
  selected,
  onToggle,
  columns = 2,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
      )}
    >
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-2xl border bg-white px-4 py-3 transition",
              active
                ? "border-[#183a1d] bg-[#f4f8f1]"
                : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50",
            )}
          >
            <Checkbox
              checked={active}
              onCheckedChange={() => onToggle(option)}
              className="mt-0.5 border-[#183a1d] data-[state=checked]:border-[#183a1d] data-[state=checked]:bg-[#183a1d]"
            />
            <span className="text-sm text-[#1f2a1a]">{option}</span>
          </label>
        );
      })}
    </div>
  );
}
