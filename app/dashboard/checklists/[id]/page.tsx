"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getChecklistInfo } from "@/lib/services/checklist/services-get";
import TextField from "@/components/common/text-field";
import { ChecklistInfo } from "@/lib/services/checklist/models";
import { ChevronLeftIcon, CheckCircleIcon } from "lucide-react";
import Button from "@/components/common/button";
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
    const matchesSection = section.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesQuestions = section.questions.some(
      (question) =>
        question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (question.guidance &&
          question.guidance
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        question.requirement_code
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    return matchesSection || matchesQuestions;
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-500">
          Loading checklist details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Checklist not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {checklist.name}
        </h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600 mb-6">{checklist.description}</p>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" /> */}
            </div>
            <TextField
              placeholder="Search sections and questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredSections?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No matching sections or questions found
          </div>
        ) : (
          <div className="space-y-8">
            {filteredSections?.map((section) => (
              <div key={section.id} className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.questions
                    .filter(
                      (question) =>
                        question.question
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        (question.guidance &&
                          question.guidance
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())) ||
                        question.requirement_code
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map((question) => (
                      <div
                        key={question.id}
                        className="bg-gray-50 rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {question.question}
                            </p>
                            {question.guidance && (
                              <p className="text-sm text-gray-500">
                                {question.guidance}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">
                              {question.requirement_code}
                            </span>
                            {question.is_mandatory && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                Mandatory
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
