"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import TextField from "@/components/common/text-field";
import { ChecklistInfo } from "@/lib/services/checklist/models";
import { CheckCircleIcon, SearchIcon, FileTextIcon } from "lucide-react";
import { getChecklistsInfo } from "@/lib/services/checklist/actions";

export default function ChecklistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [checklist, setChecklist] = useState<ChecklistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadChecklist = async () => {
      try {
        const data = await getChecklistsInfo(id);
        setChecklist(data);
      } catch (err) {
        setError("Failed to load checklist details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadChecklist();
  }, [id]);

  const filteredSections = checklist?.sections.filter((section) => {
    const matchesSection = section.question_group
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesQuestions = section.questions.some(
      (question) =>
        question.checklist_item_caption
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.question_group
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.question_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesSection || matchesQuestions;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">
            Loading checklist details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Checklist
          </h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileTextIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg text-gray-500 font-medium">
            Checklist not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FileTextIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {checklist.name}
                </h1>
                <p className="text-sm text-gray-600">{checklist.description}</p>
              </div>
            </div>

            {/* Search Field */}
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <TextField
                placeholder="Search sections and questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-8">
        {/* Content Section */}
        {filteredSections?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or browse all sections below.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSections?.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-4 border-b border-emerald-200">
                  <h2 className="text-xl font-semibold text-emerald-900 flex items-center gap-3">
                    <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {section.order_index}
                    </span>
                    {section.question_group}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {section.questions
                      .filter(
                        (question) =>
                          question.checklist_item_caption
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          question.question_group
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          question.question_type
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                      .map((question) => (
                        <div
                          key={question.id}
                          className="bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {/* Question Header */}
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 rounded-t-xl">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-base font-semibold text-gray-900 leading-relaxed mb-2">
                                  {question.checklist_item_caption}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                                    {question.question_type}
                                  </span>

                                  <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full border ${
                                      question.photo_available === "Yes"
                                        ? "text-blue-600 bg-blue-50 border-blue-200"
                                        : "text-gray-500 bg-gray-100 border-gray-200"
                                    }`}
                                  >
                                    {question.photo_available === "Yes"
                                      ? "📷 Photo Available"
                                      : "📷 No Photo Available"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full border ${
                                    question.default_answer
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-gray-100 text-gray-500 border-gray-200"
                                  }`}
                                >
                                  {question.default_answer ? (
                                    <span className="inline-flex items-center gap-1">
                                      <CheckCircleIcon className="h-3 w-3" />
                                      Default: {question.default_answer}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1">
                                      <CheckCircleIcon className="h-3 w-3" />
                                      No Default Answer
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Question Content */}
                          <div className="p-4 space-y-4">
                            {/* Answer Options */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                Answer Options
                              </h4>
                              {question.answer_options && question.answer_options.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {question.answer_options
                                    .filter(Boolean)
                                    .map((option, index) => (
                                      <div
                                        key={index}
                                        className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
                                      >
                                        <span className="text-sm text-gray-700">
                                          {option}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                  <span className="text-sm text-gray-500 italic">
                                    No answer options available
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Corrective Action Options */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                Corrective Actions
                              </h4>
                              {question.corrective_actions && question.corrective_actions.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {question.corrective_actions
                                    .filter(Boolean)
                                    .map((action, index) => (
                                      <div
                                        key={index}
                                        className="bg-orange-50 px-3 py-2 rounded-lg border border-orange-200"
                                      >
                                        <span className="text-sm text-orange-700">
                                          {action}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                  <span className="text-sm text-gray-500 italic">
                                    No corrective actions available
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Additional Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                              <div className="space-y-1">
                                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Policy Reference
                                </h5>
                                {question.policy ? (
                                  <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                    {question.policy}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-500 italic bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                    No data available
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
