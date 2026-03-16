import { Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewWidgetFactory } from "@/components/checklist/forms/PreviewWidgetFactory";
import { QuestionType } from "@/lib/services/checklist-assigned/models";
import type { AIChecklistDraft } from "@/lib/services/ai";

interface DraftPreviewProps {
  draft: AIChecklistDraft;
  questionCount: number;
  saveCategory: string;
  inferredCategory: string;
  inferredIndustry: string;
  onSaveClick: () => void;
}

export function DraftPreview({
  draft,
  questionCount,
  saveCategory,
  inferredCategory,
  inferredIndustry,
  onSaveClick,
}: DraftPreviewProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-950">
              {draft.checklist_title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-lg bg-slate-100 px-3 py-1">
                {saveCategory || inferredCategory}
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-1">
                {inferredIndustry}
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-1">
                {draft.sections.length} sections
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-1">
                {questionCount} questions
              </span>
            </div>
          </div>
        </div>

        {draft.context_summary && (
          <div className="mb-6 rounded-xl bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">
              Context
            </p>
            <p className="mt-1 text-sm text-blue-800">
              {draft.context_summary}
            </p>
          </div>
        )}

        {draft.assumptions.length > 0 && (
          <div className="mb-6 rounded-xl bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              Assumptions
            </p>
            <ul className="mt-2 space-y-1 text-sm text-amber-800">
              {draft.assumptions.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {draft.sections.map((section) => (
          <div
            key={`${section.order_index}-${section.question_group}`}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h3 className="mb-6 text-lg font-semibold text-slate-950">
              {section.order_index}. {section.question_group}
            </h3>
            <div className="space-y-8">
              {section.questions.map((question, index) => (
                <div
                  key={`${section.order_index}-${index}`}
                  className="border-l-2 border-slate-200 pl-6"
                >
                  <PreviewWidgetFactory
                    question={{
                      id: index,
                      question_type: question.question_type as QuestionType,
                      checklist_item_caption: question.checklist_item_caption,
                      default_answer: question.default_answer || null,
                      photo_available: question.photo_available,
                      answer_options: question.answer_options.filter(Boolean),
                      corrective_actions: question.corrective_actions.filter(
                        Boolean,
                      ),
                      policy: question.policy || null,
                      answer: null,
                      is_answered: false,
                      score: "N/A" as any,
                      perc_score: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {draft.follow_up_questions.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-900">
            Follow-up ideas
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {draft.follow_up_questions.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onSaveClick}
          size="lg"
          className="rounded-2xl bg-slate-950 px-6 text-white hover:bg-slate-800"
        >
          <Save className="mr-2 h-4 w-4" />
          Save checklist
        </Button>
      </div>
    </div>
  );
}
