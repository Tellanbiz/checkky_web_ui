'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAssignedCheclistWithAnswer } from '@/lib/services/checklist-assigned/get';
import { AssignedChecklistWithAnswer } from '@/lib/services/checklist-assigned/models';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionField } from '@/components/checklist-assigned/fields/QuestionField';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

export default function AnswerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [checklist, setChecklist] = useState<AssignedChecklistWithAnswer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAssignedCheclistWithAnswer(id);
        setChecklist(data);
        // Initialize answers with existing ones
        const initialAnswers: Record<number, string> = {};
        data.sections.forEach(section => {
          section.questions.forEach(q => {
            if (q.answer) {
              initialAnswers[q.id] = q.answer;
            }
          });
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error('Error fetching checklist:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      // TODO: Implement submit logic
      console.log('Submitting answers:', answers);
      // For now, just show success
      alert('Answers submitted successfully!');
    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setSubmitting(false);
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Answer Checklist
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Complete the checklist questions below
                </p>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Submit Answers
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Checklist Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>{checklist.name}</span>
              </CardTitle>
              {checklist.description && (
                <p className="text-gray-600">{checklist.description}</p>
              )}
            </CardHeader>
          </Card>

          {/* Questions by Section */}
          {checklist.sections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {section.question_group}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.questions.map((question) => (
                  <QuestionField
                    key={question.id}
                    question={question}
                    value={answers[question.id] || ''}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}