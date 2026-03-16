"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CHECKLIST_CATEGORIES } from "@/lib/checklist-categories";
import type { AIChecklistDraft } from "@/lib/services/ai";
import { generateAIChecklist, createChecklistFromAI } from "@/lib/services/ai";
import { GroupTableSelector } from "@/components/checklist/group-table-selector";
import { ChatSidebar, DraftPreview, EmptyState } from "@/components/ai";

const STORAGE_KEY = "checkky.ai-checklist-builder";

const promptIdeas = [
  "Build a forklift safety checklist for warehouse floor inspections",
  "Create a closing checklist for a multi-location retail store",
  "Generate a quality assurance checklist for food packaging lines",
];

const categoryKeywords: Record<string, string[]> = {
  agriculture: ["farm", "field", "crop", "livestock", "agriculture"],
  construction: ["construction", "site", "contractor", "building", "scaffold"],
  manufacturing: [
    "factory",
    "production",
    "assembly",
    "manufacturing",
    "plant",
  ],
  healthcare: ["clinic", "hospital", "patient", "healthcare", "medical"],
  food_processing: ["food", "kitchen", "packaging", "haccp", "cold chain"],
  transportation: ["transport", "fleet", "driver", "logistics", "vehicle"],
  retail: ["retail", "store", "cashier", "merchandise", "shop"],
  hospitality: ["hotel", "restaurant", "guest", "hospitality", "front desk"],
  education: ["school", "classroom", "student", "education", "campus"],
  government: ["government", "public", "municipal", "civic", "agency"],
  technology: ["software", "it", "technology", "data center", "saas"],
  energy: ["energy", "utility", "solar", "power", "electrical"],
  mining: ["mine", "quarry", "excavation", "mining", "haul road"],
  waste_management: [
    "waste",
    "recycling",
    "landfill",
    "disposal",
    "sanitation",
  ],
  financial_services: ["bank", "finance", "compliance", "branch", "payments"],
};

type PromptForm = {
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
};

type SaveForm = {
  name: string;
  description: string;
  category: string;
  groupId: string;
  isPublic: boolean;
};

type StoredDraft = {
  sessionId: string;
  generationId: string;
  form: PromptForm;
  save: SaveForm;
  draft: AIChecklistDraft | null;
  currentPrompt: string;
  savedAt: string;
};

const defaultForm: PromptForm = {
  name: "",
  category: "none",
  industry: "",
  goal: "",
  audience: "",
  site_context: "",
  standards: "",
  must_include: "",
  existing_context: "",
  prompt: "",
};

const defaultSave: SaveForm = {
  name: "",
  description: "",
  category: "none",
  groupId: "none",
  isPublic: false,
};

const categoryOptions = CHECKLIST_CATEGORIES.map((category) =>
  category.value === "none"
    ? { ...category, label: "AI decides (all industries)" }
    : category,
);

function getCategoryLabel(value: string) {
  return (
    categoryOptions.find((category) => category.value === value)?.label ??
    "AI decides (all industries)"
  );
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferCategoryFromText(text: string) {
  const normalized = text.toLowerCase();
  let bestMatch = "none";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const score = keywords.reduce(
      (total, keyword) => total + (normalized.includes(keyword) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }

  return bestMatch;
}

function inferChecklistName(prompt?: string) {
  if (!prompt) return "AI-generated checklist";
  const trimmed = prompt.trim();
  if (!trimmed) return "AI-generated checklist";

  const cleaned = trimmed
    .replace(/^(create|build|generate|make|draft)\s+/i, "")
    .replace(/\.$/, "");
  const base = cleaned.split(/[.!?]/)[0]?.trim() ?? cleaned;

  return toTitleCase(base.split(/\s+/).slice(0, 8).join(" "));
}

function inferIndustry(prompt: string | undefined, category: string) {
  if (category !== "none") {
    return getCategoryLabel(category).replace(" (all industries)", "");
  }
  if (!prompt) return "General operations";
  const trimmed = prompt.trim();
  if (!trimmed) return "General operations";
  return toTitleCase(trimmed.split(/\s+/).slice(0, 4).join(" "));
}

export default function AIChecklistPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState("");
  const [generationId, setGenerationId] = useState("");
  const [draft, setDraft] = useState<AIChecklistDraft | null>(null);
  const [form, setForm] = useState<PromptForm>(defaultForm);
  const [save, setSave] = useState<SaveForm>(defaultSave);
  const [restoreState, setRestoreState] = useState<StoredDraft | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const questionCount = useMemo(
    () =>
      draft?.sections.reduce(
        (sum, section) => sum + section.questions.length,
        0,
      ) ?? 0,
    [draft],
  );

  const inferredContext = useMemo(() => {
    const prompt = currentPrompt.trim() || form.prompt.trim();
    const contextText = [
      prompt,
      form.industry,
      form.goal,
      form.audience,
      form.site_context,
      form.standards,
      form.must_include,
      form.existing_context,
    ]
      .filter(Boolean)
      .join(" ");
    const category =
      form.category !== "none"
        ? form.category
        : inferCategoryFromText(contextText);
    const name = form.name.trim() || inferChecklistName(prompt);
    const industry = form.industry.trim() || inferIndustry(prompt, category);
    const goal =
      form.goal.trim() ||
      (prompt
        ? `Create a practical checklist based on this request: ${prompt}`
        : "Create a practical operational checklist.");

    return { prompt, category, name, industry, goal };
  }, [currentPrompt, form]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setHasCheckedStorage(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as StoredDraft;
      if (parsed.draft || parsed.currentPrompt || parsed.form.prompt) {
        setRestoreState(parsed);
        setRestoreDialogOpen(true);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasCheckedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hasCheckedStorage || typeof window === "undefined") return;

    const shouldStore = Boolean(
      draft ||
      currentPrompt.trim() ||
      form.name ||
      form.goal ||
      form.prompt ||
      form.site_context,
    );
    if (!shouldStore) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const payload: StoredDraft = {
      sessionId,
      generationId,
      form,
      save,
      draft,
      currentPrompt,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    currentPrompt,
    draft,
    form,
    generationId,
    hasCheckedStorage,
    save,
    sessionId,
  ]);

  const setField = (key: keyof PromptForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const setSaveField = (key: keyof SaveForm, value: string | boolean) =>
    setSave((current) => ({ ...current, [key]: value }));

  const clearStoredDraft = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const restoreDraft = () => {
    if (!restoreState) return;

    setSessionId(restoreState.sessionId);
    setGenerationId(restoreState.generationId);
    setForm(restoreState.form);
    setSave(restoreState.save);
    setDraft(restoreState.draft);
    setCurrentPrompt(
      restoreState.currentPrompt || restoreState.form.prompt || "",
    );
    setRestoreDialogOpen(false);
    toast({
      title: "Draft restored",
      description: "Your last AI checklist session is back in place.",
    });
  };

  const discardStoredDraft = () => {
    clearStoredDraft();
    setRestoreState(null);
    setRestoreDialogOpen(false);
  };

  const handleGenerate = async () => {
    const promptValue = currentPrompt.trim();
    if (!promptValue) {
      toast({
        title: "Start with a prompt",
        description:
          "Describe the checklist you want and the AI will fill in the rest.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      session_id: sessionId || undefined,
      name: inferredContext.name,
      category: inferredContext.category || "none",
      industry: inferredContext.industry,
      goal: inferredContext.goal,
      audience: form.audience.trim(),
      site_context: form.site_context.trim(),
      standards: form.standards.trim(),
      must_include: form.must_include.trim(),
      existing_context: form.existing_context.trim(),
      prompt: promptValue,
    };

    setForm((current) => ({
      ...current,
      name: payload.name,
      category: payload.category,
      industry: payload.industry,
      goal: payload.goal,
      prompt: payload.prompt,
    }));

    try {
      setIsGenerating(true);
      const result = await generateAIChecklist(payload);
      setSessionId(result.session_id);
      setGenerationId(result.generation_id);
      setDraft(result.draft);
      setSave((current) => ({
        ...current,
        name: result.draft.checklist_title || payload.name,
        description: result.draft.description || payload.goal,
        category: payload.category,
      }));
      toast({
        title: "Draft ready",
        description: "The AI prepared a checklist draft from your prompt.",
      });
    } catch (error) {
      toast({
        title: "Could not generate checklist",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreate = async () => {
    if (!draft || !generationId || !save.name || !save.category) {
      toast({
        title: "Draft not ready",
        description: "Generate a draft and review the save settings first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const result = await createChecklistFromAI({
        generation_id: generationId,
        name: save.name,
        description: save.description,
        category: save.category || "none",
        checklist_group_id:
          save.groupId !== "none" ? Number(save.groupId) : undefined,
        is_public: save.isPublic,
      });

      clearStoredDraft();
      toast({
        title: "Checklist created",
        description: `"${save.name}" has been added to your checklist library.`,
      });
      router.push(`/dashboard/checklists/${result.checklist_id}`);
    } catch (error) {
      toast({
        title: "Could not create checklist",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="flex h-full bg-white text-slate-900">
        <div className="w-96 h-full border-r border-slate-200">
          <ChatSidebar
            currentPrompt={currentPrompt}
            draft={draft}
            showSettings={showSettings}
            form={form}
            questionCount={questionCount}
            isGenerating={isGenerating}
            promptIdeas={promptIdeas}
            categoryOptions={categoryOptions}
            onPromptChange={setCurrentPrompt}
            onSettingsToggle={() => setShowSettings(!showSettings)}
            onSaveClick={() => setSaveDialogOpen(true)}
            onGenerate={handleGenerate}
            onFieldChange={setField}
          />
        </div>

        <div className="flex-1 overflow-y-auto h-full">
          <div className="mx-auto max-w-5xl px-8 py-8">
            {!draft ? (
              <EmptyState />
            ) : (
              <DraftPreview
                draft={draft}
                questionCount={questionCount}
                saveCategory={save.category}
                inferredCategory={inferredContext.category}
                inferredIndustry={inferredContext.industry}
                onSaveClick={() => setSaveDialogOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent className="max-w-xl rounded-[28px] border-slate-200 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>Restore your last AI checklist draft?</DialogTitle>
            <DialogDescription className="text-slate-500">
              A previous draft was found in local storage. You can continue
              where you left off or start fresh.
            </DialogDescription>
          </DialogHeader>

          {restoreState && (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-950">
                {restoreState.form.name ||
                  inferChecklistName(restoreState.currentPrompt)}
              </p>
              <p className="mt-1 text-slate-500">
                Saved {new Date(restoreState.savedAt).toLocaleString()}
              </p>
              {restoreState.draft && (
                <p className="mt-2 text-slate-500">
                  {restoreState.draft.sections.length} sections,{" "}
                  {restoreState.draft.sections.reduce(
                    (sum, section) => sum + section.questions.length,
                    0,
                  )}{" "}
                  questions
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={discardStoredDraft}
              className="border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100"
            >
              Start fresh
            </Button>
            <Button
              onClick={restoreDraft}
              className="bg-slate-950 text-white hover:bg-slate-800"
            >
              Restore draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[28px] border-slate-200 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>Save settings</DialogTitle>
            <DialogDescription className="text-slate-500">
              Choose how this AI-generated checklist should be added to your
              checklist library.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label className="text-slate-700">Checklist title</Label>
              <Input
                value={save.name}
                onChange={(event) => setSaveField("name", event.target.value)}
                className="h-11 rounded-2xl border-slate-200 bg-white text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700">Description</Label>
              <Textarea
                rows={4}
                value={save.description}
                onChange={(event) =>
                  setSaveField("description", event.target.value)
                }
                className="rounded-2xl border-slate-200 bg-white text-slate-900"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-slate-700">Type</Label>
                <Select
                  value={save.category}
                  onValueChange={(value) => setSaveField("category", value)}
                >
                  <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-slate-900">
                    <SelectValue placeholder="AI decides" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-200 bg-white text-slate-900">
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Group</Label>
                <GroupTableSelector
                  selectedGroupId={save.groupId}
                  onGroupChange={(value) => setSaveField("groupId", value)}
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-950">
                  Make checklist public
                </p>
                <p className="text-xs text-slate-500">
                  Public checklists can be reused by other teams in the
                  platform.
                </p>
              </div>
              <Switch
                checked={save.isPublic}
                onCheckedChange={(checked) => setSaveField("isPublic", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              className="border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100"
            >
              Close
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-slate-950 text-white hover:bg-slate-800"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving checklist
                </>
              ) : (
                <>
                  Create checklist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
