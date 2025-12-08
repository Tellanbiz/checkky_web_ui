'use client';

import { useState } from 'react';
import { AssignedChecklistWithAnswer } from '@/lib/services/checklist-assigned/models';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react';

interface AnswerTableOfContentsProps {
  checklist: AssignedChecklistWithAnswer;
  onSectionClick: (sectionIndex: number) => void;
  onQuestionClick: (sectionIndex: number, questionIndex: number) => void;
  activeSection?: number;
  activeQuestion?: { sectionIndex: number; questionIndex: number };
}

export function AnswerTableOfContents({
  checklist,
  onSectionClick,
  onQuestionClick,
  activeSection,
  activeQuestion
}: AnswerTableOfContentsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(checklist.sections.map((_, index) => index))
  );

  const toggleSection = (sectionIndex: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionIndex)) {
      newExpanded.delete(sectionIndex);
    } else {
      newExpanded.add(sectionIndex);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionStats = (section: any) => {
    const totalQuestions = section.questions.length;
    const answeredQuestions = section.questions.filter((q: any) => q.is_answered).length;
    return { totalQuestions, answeredQuestions };
  };

  const isQuestionActive = (sectionIndex: number, questionIndex: number) => {
    return activeQuestion?.sectionIndex === sectionIndex && activeQuestion?.questionIndex === questionIndex;
  };

  return (
    <div className="h-fit sticky top-6">
      <div className="pb-3">
        <h3 className="text-lg font-semibold">Table of Contents</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{checklist.name}</span>
          <Badge variant="outline" className="text-xs">
            {checklist.sections.reduce((acc, section) => acc + section.questions.length, 0)} Questions
          </Badge>
        </div>
      </div>
      <div className="pt-0">
        <div className="space-y-2">
          {checklist.sections.map((section, sectionIndex) => {
            const { totalQuestions, answeredQuestions } = getSectionStats(section);
            const isExpanded = expandedSections.has(sectionIndex);
            const isActive = activeSection === sectionIndex;

            return (
              <div key={sectionIndex} className="rounded-lg">
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    toggleSection(sectionIndex);
                    onSectionClick(sectionIndex);
                  }}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm font-medium">{section.question_group}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {answeredQuestions}/{totalQuestions}
                    </span>
                    {answeredQuestions === totalQuestions && totalQuestions > 0 && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-gray-50/50">
                    {section.questions.map((question, questionIndex) => (
                      <div
                        key={question.id}
                        className={`flex items-center space-x-2 px-3 py-2 cursor-pointer text-xs transition-colors ${
                          isQuestionActive(sectionIndex, questionIndex)
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuestionClick(sectionIndex, questionIndex);
                        }}
                      >
                        {question.is_answered ? (
                          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="truncate flex-1">
                          {question.checklist_item_caption}
                        </span>
                        {question.photo_available === 'Yes' && (
                          <Badge variant="outline" className="text-xs h-4 px-1">
                            📷
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
