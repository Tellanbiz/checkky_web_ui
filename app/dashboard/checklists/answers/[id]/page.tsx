"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAssignedCheclistWithAnswer } from "@/lib/services/checklist-assigned/get";
import {
  AssignedChecklistWithAnswer,
  AuditScore,
} from "@/lib/services/checklist-assigned/models";
import { TeamMember } from "@/lib/services/teams/data";
import { Button } from "@/components/ui/button";
import { QuestionWidgetFactory } from "@/components/checklist/forms/QuestionWidgetFactory";
import { AnswerTableOfContents } from "@/components/checklist/forms/AnswerTableOfContents";
import { AssignAuditorDialog } from "@/components/checklist/answers/AssignAuditorDialog";
import { ArrowLeft, Loader2, User } from "lucide-react";

export default function AnswerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [photos, setPhotos] = useState<Record<number, string>>({});
  const [auditScores, setAuditScores] = useState<Record<number, AuditScore>>(
    {}
  );
  const [activeSection, setActiveSection] = useState<number | undefined>();
  const [activeQuestion, setActiveQuestion] = useState<
    { sectionIndex: number; questionIndex: number } | undefined
  >();
  const [assignAuditorDialogOpen, setAssignAuditorDialogOpen] = useState(false);

  // TanStack Query for fetching checklist data
  const {
    data: checklist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assigned-checklist", id],
    queryFn: () => getAssignedCheclistWithAnswer(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Initialize answers when data is loaded
  useEffect(() => {
    if (checklist) {
      // Initialize answers with existing ones
      const initialAnswers: Record<number, string> = {};
      const initialAuditScores: Record<number, AuditScore> = {};

      checklist.sections.forEach((section: any) => {
        section.questions.forEach((q: any) => {
          if (q.answer) {
            initialAnswers[q.id] = q.answer;
          }
          initialAuditScores[q.id] = q.score || AuditScore.Pending;
        });
      });
      setAnswers(initialAnswers);
      setAuditScores(initialAuditScores);
    }
  }, [checklist]);

  const handleSectionClick = (sectionIndex: number) => {
    setActiveSection(sectionIndex);
    setActiveQuestion(undefined);
    const element = document.getElementById(`section-${sectionIndex}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleQuestionClick = (sectionIndex: number, questionIndex: number) => {
    setActiveSection(sectionIndex);
    setActiveQuestion({ sectionIndex, questionIndex });
    const element = document.getElementById(
      `question-${sectionIndex}-${questionIndex}`
    );
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCommentChange = (questionId: number, comment: string) => {
    setComments((prev) => ({ ...prev, [questionId]: comment }));
  };

  const handleGalleryPress = (questionId: number, isSignature = false) => {
    // TODO: Implement gallery selection
    console.log(
      `Gallery pressed for question ${questionId}, signature: ${isSignature}`
    );
  };

  const handleCameraPress = (questionId: number, isSignature = false) => {
    // TODO: Implement camera capture
    console.log(
      `Camera pressed for question ${questionId}, signature: ${isSignature}`
    );
  };

  const handleAuditScoreChange = (questionId: number, score: AuditScore) => {
    setAuditScores((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleAssignAuditor = (member: TeamMember) => {
    // TODO: Implement API call to assign auditor
    console.log("Assigning auditor:", member);

    setAssignAuditorDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">
            Loading checklist answers...
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
            {error instanceof Error
              ? error.message
              : "Failed to load checklist. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (!checklist) {
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
            Checklist Not Found
          </h3>
          <p className="text-sm text-red-600">
            The checklist you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {checklist.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      checklist.status === "completed"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : checklist.status === "in_progress"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {checklist.status.charAt(0).toUpperCase() +
                      checklist.status.slice(1).replace("_", " ")}
                  </span>
                </div>
                {checklist.description && (
                  <p className="text-sm text-gray-600">
                    {checklist.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                {checklist.auditor ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {checklist.auditor.full_name}
                      </p>
                      <p className="text-xs text-gray-500">Auditor</p>
                    </div>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <Button
                      onClick={() => setAssignAuditorDialogOpen(true)}
                      variant="outline"
                      className="text-xs rounded-full"
                      size="sm"
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setAssignAuditorDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-sm"
                    size="sm"
                  >
                    <User className="mr-1.5 h-4 w-4" />
                    Assign Auditor
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Table of Contents */}
        <div className="hidden lg:block w-80 border-r border-gray-200 bg-white">
          <div className="sticky top-0 p-4 max-h-screen overflow-y-auto">
            <AnswerTableOfContents
              checklist={checklist}
              onSectionClick={handleSectionClick}
              onQuestionClick={handleQuestionClick}
              activeSection={activeSection}
              activeQuestion={activeQuestion}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Questions by Section */}
            {checklist.sections.map((section: any, sectionIndex: number) => (
              <div
                key={sectionIndex}
                id={`section-${sectionIndex}`}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
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
                  {section.questions.map(
                    (question: any, questionIndex: number) => (
                      <div
                        key={question.id}
                        id={`question-${sectionIndex}-${questionIndex}`}
                      >
                        <QuestionWidgetFactory
                          question={question}
                          value={answers[question.id] || ""}
                          onAnswerChanged={(value) =>
                            handleAnswerChange(question.id, value || "")
                          }
                          onCommentChanged={(comment) =>
                            handleCommentChange(question.id, comment)
                          }
                          photoUrl={photos[question.id]}
                          auditScore={
                            auditScores[question.id] || AuditScore.Pending
                          }
                          onAuditScoreChange={(score) =>
                            handleAuditScoreChange(question.id, score)
                          }
                          checklistStatus={checklist?.status || "pending"}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Auditor Dialog */}
      <AssignAuditorDialog
        open={assignAuditorDialogOpen}
        onOpenChange={setAssignAuditorDialogOpen}
        currentAuditorId={checklist?.auditor?.id}
        checklistId={id}
        onAssignAuditor={handleAssignAuditor}
      />
    </div>
  );
}
