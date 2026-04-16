"use client";

import {
  QuestionType,
  AuditScore,
} from "@/lib/services/checklist-assigned/models";

interface PreviewWidgetFactoryProps {
  question: {
    id: number;
    question_type: QuestionType;
    checklist_item_caption: string;
    default_answer: string | null;
    photo_available: string;
    answer_options: string[];
    corrective_option?: string | null;
    corrective_actions: string[];
    policy: string | null;
    answer: string | null;
    is_answered: boolean;
    score: AuditScore;
    perc_score: number;
    checklist_answer_id?: string;
  };
}

export function PreviewWidgetFactory({ question }: PreviewWidgetFactoryProps) {
  const hasAttachment = question.photo_available.toLowerCase() === "yes";

  const renderQuestionPreview = () => {
    switch (question.question_type) {
      case QuestionType.Text:
      case QuestionType.Memo:
        return (
          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <textarea
              className="w-full min-h-[80px] p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 resize-none"
              placeholder="Text input..."
              value={question.answer || ""}
              disabled
            />
          </div>
        );

      case QuestionType.RadiobuttonList:
      case QuestionType.RadioButton:
        return (
          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <div className="space-y-2">
              {question.answer_options?.map((option: string, index: number) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-not-allowed"
                >
                  <input
                    type="radio"
                    className="w-4 h-4 text-primary border-gray-300"
                    checked={question.answer === option}
                    disabled
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case QuestionType.CheckboxList:
      case QuestionType.CheckBoxList:
        return (
          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <div className="space-y-2">
              {question.answer_options?.map((option: string, index: number) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-not-allowed"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded"
                    checked={question.answer?.includes(option) || false}
                    disabled
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case QuestionType.Decimal:
      case QuestionType.Integer:
      case QuestionType.Temperature:
        return (
          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <input
              type="number"
              className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
              placeholder="Numeric input..."
              value={question.answer || ""}
              disabled
            />
          </div>
        );

      case QuestionType.Date:
        return (
          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <input
              type="date"
              className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
              value={question.answer || ""}
              disabled
            />
          </div>
        );

      case QuestionType.Time:
        return (
          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <input
              type="time"
              className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
              value={question.answer || ""}
              disabled
            />
          </div>
        );

      case QuestionType.Signature:
        return (
          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <p className="text-sm text-gray-500">Signature field</p>
              {question.answer && (
                <p className="text-xs text-gray-600 mt-2">Signature provided</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Question type: {question.question_type}
            </p>
            {question.answer && (
              <p className="text-sm text-gray-900 mt-2">
                Answer: {question.answer}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Caption */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {question.checklist_item_caption}
        </h3>
        {question.policy && (
          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="font-medium text-blue-800">Policy:</span>{" "}
            {question.policy}
          </p>
        )}
      </div>

      {/* Question Input Preview */}
      <div>{renderQuestionPreview()}</div>

      {/* Answer Options */}
      {question.answer_options && question.answer_options.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Answer Options:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.answer_options
              .filter(Boolean)
              .map((option: string, index: number) => (
                <div
                  key={index}
                  className="bg-white px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700"
                >
                  {option}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Corrective Actions */}
      {question.corrective_actions &&
        question.corrective_actions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Corrective Actions{question.corrective_option ? ` when "${question.corrective_option}" is selected` : ""}:
            </h4>
            <div className="space-y-2">
              {question.corrective_actions
                .filter(Boolean)
                .map((action: string, index: number) => (
                  <div
                    key={index}
                    className="bg-red-50 px-3 py-2 rounded-lg border border-red-200 text-sm text-red-800"
                  >
                    {action}
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Default Answer */}
      {question.default_answer && (
        <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <span className="text-sm font-medium text-green-800">
            Default Answer:
          </span>
          <span className="text-sm text-green-700 ml-2">
            {question.default_answer}
          </span>
        </div>
      )}

      {/* Photo Available Badge */}
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full border ${
            hasAttachment
              ? "text-primary bg-primary/10 border-primary/20"
              : "text-gray-500 bg-gray-100 border-gray-200"
          }`}
        >
          {hasAttachment ? "Photo Available" : "No Photo Available"}
        </span>
      </div>
    </div>
  );
}
