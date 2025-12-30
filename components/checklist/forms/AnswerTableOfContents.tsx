'use client';

import { useState } from 'react';
import { AssignedChecklistWithAnswer } from '@/lib/services/checklist-assigned/models';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, CheckCircle, Circle, ListChecks, Camera } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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

  const calculateOverallProgress = () => {
    const totalQuestions = checklist.sections.reduce(
      (acc, section) => acc + section.questions.length,
      0
    );
    const answeredQuestions = checklist.sections.reduce(
      (acc, section) =>
        acc + section.questions.filter((q: any) => q.is_answered).length,
      0
    );
    return totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  };

  const getSectionProgress = (section: any) => {
    const { totalQuestions, answeredQuestions } = getSectionStats(section);
    return totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  };

  const isQuestionActive = (sectionIndex: number, questionIndex: number) => {
    return activeQuestion?.sectionIndex === sectionIndex && activeQuestion?.questionIndex === questionIndex;
  };

  const totalQuestions = checklist.sections.reduce(
    (acc, section) => acc + section.questions.length,
    0
  );
  const answeredQuestions = checklist.sections.reduce(
    (acc, section) =>
      acc + section.questions.filter((q: any) => q.is_answered).length,
    0
  );

  return (
    <div className="h-fit sticky top-6">
      {/* Header with Progress */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <ListChecks className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Table of Contents</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3 truncate">{checklist.name}</p>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Overall Progress</span>
            <span className="text-gray-900 font-semibold">
              {answeredQuestions}/{totalQuestions} ({calculateOverallProgress()}%)
            </span>
          </div>
          <Progress value={calculateOverallProgress()} className="h-2" />
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-1">
          {checklist.sections.map((section, sectionIndex) => {
            const { totalQuestions, answeredQuestions } = getSectionStats(section);
            const isExpanded = expandedSections.has(sectionIndex);
            const isActive = activeSection === sectionIndex;

            return (
              <div key={sectionIndex} className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                  }`}
                  onClick={() => {
                    toggleSection(sectionIndex);
                    onSectionClick(sectionIndex);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {section.question_group}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        answeredQuestions === totalQuestions && totalQuestions > 0
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {answeredQuestions}/{totalQuestions}
                    </Badge>
                    {answeredQuestions === totalQuestions && totalQuestions > 0 && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {/* Section Progress Bar */}
                    <div className="px-3 py-2 bg-gray-50/50">
                      <Progress value={getSectionProgress(section)} className="h-1.5" />
                    </div>
                    
                    {/* Questions List */}
                    <div className="divide-y divide-gray-100">
                      {section.questions.map((question, questionIndex) => {
                        const isActive = isQuestionActive(sectionIndex, questionIndex);
                        return (
                          <div
                            key={question.id}
                            className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-all ${
                              isActive
                                ? 'bg-blue-100 border-l-4 border-l-blue-500'
                                : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuestionClick(sectionIndex, questionIndex);
                            }}
                          >
                            {question.is_answered ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={`text-xs flex-1 truncate ${
                              isActive ? 'text-blue-900 font-medium' : 'text-gray-700'
                            }`}>
                              {question.checklist_item_caption}
                            </span>
                            {question.photo_available === 'Yes' && (
                              <Camera className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

  );
}
