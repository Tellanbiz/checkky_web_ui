"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TextField from "@/components/common/text-field";
import { Button } from "@/components/ui/button";
import { QuestionWidgetFactory } from "@/components/checklist/forms/QuestionWidgetFactory";
import { PreviewWidgetFactory } from "@/components/checklist/forms/PreviewWidgetFactory";
import { CheckCircleIcon, SearchIcon, FileTextIcon, Users } from "lucide-react";
import { getChecklistsInfo } from "@/lib/services/checklist/actions";

export default function ChecklistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // TanStack Query for fetching checklist data
  const {
    data: checklist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checklist", id],
    queryFn: () => getChecklistsInfo(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const filteredSections = checklist?.sections.filter((section: any) => {
    const matchesSection = section.question_group
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesQuestions = section.questions.some(
      (question: any) =>
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

  const tocSections = filteredSections ?? [];
  const getSectionId = (orderIndex: number) => `section-${orderIndex}`;
  const scrollToSection = (orderIndex: number) => {
    const el = document.getElementById(getSectionId(orderIndex));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAssignChecklist = () => {
    router.push(`/dashboard/checklists/assign/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">
            Loading checklist details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
          <p className="text-sm text-red-600">
            Failed to load checklist details. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <FileTextIcon className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {checklist.name}
                </h1>
                <p className="text-sm text-gray-600">{checklist.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center">
              {/* Assign Button */}
              <Button
                onClick={handleAssignChecklist}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full w-full sm:w-auto"
              >
                <Users className="mr-2 h-4 w-4" />
                Assign Checklist
              </Button>

              {/* Search Field */}
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <TextField
                  placeholder="Search sections and questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 w-full border-gray-200 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Table of Contents Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="font-semibold text-gray-900 mb-4 text-lg">
                Contents
              </div>
              <div className="space-y-1">
                {tocSections.length === 0 ? (
                  <div className="text-sm text-gray-500 italic py-2">
                    No sections available
                  </div>
                ) : (
                  tocSections.map((section: any) => (
                    <button
                      key={section.order_index}
                      type="button"
                      onClick={() => scrollToSection(section.order_index)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-primary/5 hover:text-primary hover:border-primary/20 border border-transparent transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-gray-100 group-hover:bg-primary/10 text-gray-600 group-hover:text-primary rounded-full flex items-center justify-center text-xs font-semibold transition-colors flex-shrink-0">
                          {section.order_index}
                        </span>
                        <span className="line-clamp-2 font-medium group-hover:text-primary transition-colors">
                          {section.question_group}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Mobile Table of Contents */}
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="font-semibold text-gray-900 mb-3 text-base">
                Contents
              </div>
              <div className="grid gap-2">
                {tocSections.length === 0 ? (
                  <div className="text-sm text-gray-500 italic py-2">
                    No sections available
                  </div>
                ) : (
                  tocSections.map((section: any) => (
                    <button
                      key={section.order_index}
                      type="button"
                      onClick={() => scrollToSection(section.order_index)}
                      className="text-left px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-primary/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-100 group-hover:bg-primary/10 text-gray-600 group-hover:text-primary rounded-full flex items-center justify-center text-xs font-semibold transition-colors flex-shrink-0">
                          {section.order_index}
                        </span>
                        <span className="text-sm font-medium text-gray-900 group-hover:text-primary line-clamp-1 transition-colors">
                          {section.question_group}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
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
                {filteredSections?.map((section: any) => (
                  <div
                    key={section.order_index}
                    id={getSectionId(section.order_index)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {section.order_index}
                        </span>
                        {section.question_group}
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      {section.questions
                        .filter(
                          (question: any) =>
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
                        .map((question: any) => (
                          <div
                            key={question.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-all"
                          >
                            <PreviewWidgetFactory question={question} />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
