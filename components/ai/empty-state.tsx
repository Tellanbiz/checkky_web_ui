import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Sparkles className="h-8 w-8 text-slate-600" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-950">
          AI Checklist Builder
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Describe what you need in the chat sidebar, and I'll generate a complete checklist with proper structure, question types, and validation rules.
        </p>
      </div>
    </div>
  );
}
