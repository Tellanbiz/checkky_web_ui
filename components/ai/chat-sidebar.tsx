import { Settings2, Save, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowRight } from "lucide-react";
import type { AIChecklistDraft } from "@/lib/services/ai";

interface PromptForm {
  name: string;
  category: string;
  industry: string;
  goal: string;
  audience: string;
  site_context: string;
  standards: string;
  must_include: string;
  existing_context: string;
  prompt: string;
}

interface ChatSidebarProps {
  currentPrompt: string;
  draft: AIChecklistDraft | null;
  showSettings: boolean;
  form: PromptForm;
  questionCount: number;
  isGenerating: boolean;
  promptIdeas: string[];
  categoryOptions: Array<{ value: string; label: string }>;
  onPromptChange: (prompt: string) => void;
  onSettingsToggle: () => void;
  onSaveClick: () => void;
  onGenerate: () => void;
  onFieldChange: (field: keyof PromptForm, value: string) => void;
}

export function ChatSidebar({
  currentPrompt,
  draft,
  showSettings,
  form,
  questionCount,
  isGenerating,
  promptIdeas,
  categoryOptions,
  onPromptChange,
  onSettingsToggle,
  onSaveClick,
  onGenerate,
  onFieldChange,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-950">AI Builder</h1>
            <p className="text-xs text-slate-500">Checklist generation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!showSettings ? (
          <div className="space-y-4">
            {!currentPrompt.trim() && (
              <div>
                <h2 className="text-sm font-medium text-slate-900">
                  Quick prompts
                </h2>
                <div className="mt-3 space-y-2">
                  {promptIdeas.map((idea) => (
                    <button
                      key={idea}
                      type="button"
                      onClick={() => onPromptChange(idea)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {draft && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">
                  Current draft
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {draft.checklist_title}
                </p>
                <div className="mt-3 flex gap-2 text-xs text-slate-500">
                  <span>{draft.sections.length} sections</span>
                  <span>•</span>
                  <span>{questionCount} questions</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-950">
                AI Context Settings
              </h2>
              <button
                onClick={onSettingsToggle}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Checklist name
                </Label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    onFieldChange("name", event.target.value)
                  }
                  placeholder="Let AI title it"
                  className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Type preference
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => onFieldChange("category", value)}
                >
                  <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                    <SelectValue placeholder="AI decides" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Industry focus
                </Label>
                <Input
                  value={form.industry}
                  onChange={(event) =>
                    onFieldChange("industry", event.target.value)
                  }
                  placeholder="Optional"
                  className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Main goal
                </Label>
                <Textarea
                  rows={2}
                  value={form.goal}
                  onChange={(event) =>
                    onFieldChange("goal", event.target.value)
                  }
                  placeholder="Optional"
                  className="rounded-lg border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Audience
                </Label>
                <Input
                  value={form.audience}
                  onChange={(event) =>
                    onFieldChange("audience", event.target.value)
                  }
                  placeholder="Optional"
                  className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Site context
                </Label>
                <Textarea
                  rows={3}
                  value={form.site_context}
                  onChange={(event) =>
                    onFieldChange("site_context", event.target.value)
                  }
                  placeholder="Risks, workflow notes"
                  className="rounded-lg border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Standards
                </Label>
                <Input
                  value={form.standards}
                  onChange={(event) =>
                    onFieldChange("standards", event.target.value)
                  }
                  placeholder="OSHA, ISO 22000"
                  className="h-9 rounded-lg border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Must include
                </Label>
                <Textarea
                  rows={2}
                  value={form.must_include}
                  onChange={(event) =>
                    onFieldChange("must_include", event.target.value)
                  }
                  placeholder="Critical sections"
                  className="rounded-lg border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">
                  Existing context
                </Label>
                <Textarea
                  rows={2}
                  value={form.existing_context}
                  onChange={(event) =>
                    onFieldChange("existing_context", event.target.value)
                  }
                  placeholder="Past notes"
                  className="rounded-lg border-slate-200 bg-white text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 border-t border-slate-200 bg-white p-4">
        <div className="space-y-3">
          <Textarea
            value={currentPrompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Describe the checklist you need..."
            className="min-h-[60px] resize-none rounded-lg border-slate-200 text-sm"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={onSettingsToggle}
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Settings2 className="h-4 w-4" />
            </button>
            {draft && (
              <button
                onClick={onSaveClick}
                className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Save className="h-4 w-4" />
              </button>
            )}
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="flex-1 rounded-lg bg-slate-950 text-white hover:bg-slate-800"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  Generate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
