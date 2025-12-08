'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAssignedCheclistWithAnswer } from '@/lib/services/checklist-assigned/get';
import { AssignedChecklistWithAnswer, AuditScore } from '@/lib/services/checklist-assigned/models';
import { TeamMember } from '@/lib/services/teams/data';
import { Button } from '@/components/ui/button';
import { QuestionWidgetFactory } from '@/components/checklist/forms/QuestionWidgetFactory';
import { AnswerTableOfContents } from '@/components/checklist/forms/AnswerTableOfContents';
import { AssignAuditorDialog } from '@/components/checklist/answers/AssignAuditorDialog';
import { ArrowLeft, Loader2, User } from 'lucide-react';

export default function AnswerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [checklist, setChecklist] = useState<AssignedChecklistWithAnswer | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [photos, setPhotos] = useState<Record<number, string>>({});
  const [auditScores, setAuditScores] = useState<Record<number, AuditScore>>({});
  const [activeSection, setActiveSection] = useState<number | undefined>();
  const [activeQuestion, setActiveQuestion] = useState<{ sectionIndex: number; questionIndex: number } | undefined>();
  const [assignAuditorDialogOpen, setAssignAuditorDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAssignedCheclistWithAnswer(id);
        setChecklist(data);
        // Initialize answers with existing ones
        const initialAnswers: Record<number, string> = {};
        const initialAuditScores: Record<number, AuditScore> = {};

        data.sections.forEach(section => {
          section.questions.forEach(q => {
            if (q.answer) {
              initialAnswers[q.id] = q.answer;
            }
            initialAuditScores[q.id] = q.score || AuditScore.Pending;
          });
        });
        setAnswers(initialAnswers);
        setAuditScores(initialAuditScores);
      } catch (error) {
        console.error('Error fetching checklist:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSectionClick = (sectionIndex: number) => {
    setActiveSection(sectionIndex);
    setActiveQuestion(undefined);
    const element = document.getElementById(`section-${sectionIndex}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleQuestionClick = (sectionIndex: number, questionIndex: number) => {
    setActiveSection(sectionIndex);
    setActiveQuestion({ sectionIndex, questionIndex });
    const element = document.getElementById(`question-${sectionIndex}-${questionIndex}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCommentChange = (questionId: number, comment: string) => {
    setComments(prev => ({ ...prev, [questionId]: comment }));
  };

  const handleGalleryPress = (questionId: number, isSignature = false) => {
    // TODO: Implement gallery selection
    console.log(`Gallery pressed for question ${questionId}, signature: ${isSignature}`);
  };

  const handleCameraPress = (questionId: number, isSignature = false) => {
    // TODO: Implement camera capture
    console.log(`Camera pressed for question ${questionId}, signature: ${isSignature}`);
  };

  const handleAuditScoreChange = (questionId: number, score: AuditScore) => {
    setAuditScores(prev => ({ ...prev, [questionId]: score }));
  };

  const handleAssignAuditor = (member: TeamMember) => {
    // TODO: Implement API call to assign auditor
    console.log('Assigning auditor:', member);
    
    // Update local state to show the new auditor
    if (checklist) {
      setChecklist({
        ...checklist,
        auditor: {
          email: member.user.email,
          full_name: member.user.full_name,
          id: member.id,
          member_id: member.id,
          role: member.role
        }
      });
    }
    
    setAssignAuditorDialogOpen(false);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">
            Loading checklist answers...
          </p>
        </div>
      </div>
    );
  }

  if (!checklist) {
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
            Checklist Not Found
          </h3>
          <p className="text-sm text-red-600">The checklist you're looking for doesn't exist or has been removed.</p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
                <h1 className="text-1xl font-semibold text-gray-900">
                  Answer Checklist Questions
                </h1>
            </div>
            <div className="flex items-center space-x-4">
              {checklist.auditor ? (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{checklist.auditor.full_name} (Auditor)</p>
                  </div>
                  <Button
                    onClick={() => {
                      setAssignAuditorDialogOpen(true);
                    }}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    Reassign Auditor
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setAssignAuditorDialogOpen(true);
                  }}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Assign Auditor
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex ">
        {/* Sidebar - Table of Contents */}
        <div className="w-96 p-4 border-r border-gray-200">
          <AnswerTableOfContents
            checklist={checklist}
            onSectionClick={handleSectionClick}
            onQuestionClick={handleQuestionClick}
            activeSection={activeSection}
            activeQuestion={activeQuestion}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="space-y-6">
          {/* Questions by Section */}
          {checklist.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} id={`section-${sectionIndex}`} className="border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">
                  {section.question_group}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {section.questions.map((question, questionIndex) => (
                  <div key={question.id} id={`question-${sectionIndex}-${questionIndex}`}>
                    <QuestionWidgetFactory
                      question={question}
                      value={answers[question.id] || ''}
                      onAnswerChanged={(value) => handleAnswerChange(question.id, value || '')}
                      onCommentChanged={(comment) => handleCommentChange(question.id, comment)}
                      photoUrl={photos[question.id]}
                      auditScore={auditScores[question.id] || AuditScore.Pending}
                      onAuditScoreChange={(score) => handleAuditScoreChange(question.id, score)}
                      checklistStatus={checklist?.status || 'pending'}
                    />
                  </div>
                ))}
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