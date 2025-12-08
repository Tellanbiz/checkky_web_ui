'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface CheckboxListWidgetProps {
  question: {
    id: number;
    checklist_item_caption: string;
    default_answer: string | null;
    answer_options: string[];
    corrective_actions: string[];
    policy: string | null;
    is_answered: boolean;
  };
  value: string;
  onAnswerChanged: (value: string | null) => void;
  onCommentChanged: (comment: string) => void;
  onGalleryPressed: () => void;
  onCameraPressed: () => void;
}

export function CheckboxListWidget({
  question,
  value,
  onAnswerChanged,
  onCommentChanged,
  onGalleryPressed,
  onCameraPressed
}: CheckboxListWidgetProps) {
  const [comment, setComment] = useState('');
  const selectedValues = value ? value.split(',') : [];

  const handleCheckboxChange = (option: string, checked: boolean) => {
    let newValues: string[];
    if (checked) {
      newValues = [...selectedValues, option];
    } else {
      newValues = selectedValues.filter(v => v !== option);
    }
    onAnswerChanged(newValues.join(','));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    onCommentChanged(newComment);
  };

  return (
    <div className="space-y-3">
      {/* Question Label */}
      <div className="flex items-start justify-between">
        <Label className="text-sm font-medium leading-6">
          {question.checklist_item_caption}
        </Label>
        {question.is_answered && (
          <Badge variant="secondary" className="text-xs">
            Answered
          </Badge>
        )}
      </div>

      {/* Checkbox Options */}
      <div className="space-y-3">
        {question.answer_options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
            <Checkbox
              id={`checkbox-${question.id}-${index}`}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
              className="flex-shrink-0"
              disabled
            />
            <Label
              htmlFor={`checkbox-${question.id}-${index}`}
              className="text-sm font-normal flex-1 text-gray-900"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedValues.length > 0 && (
        <div className="p-2 bg-gray-50 rounded border">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Selected:</span> {selectedValues.join(', ')}
          </p>
        </div>
      )}

      {/* Comment Section */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600">Comments (Optional)</Label>
        <Textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add any additional comments..."
          className="min-h-[60px] resize-none text-sm text-gray-900"
          disabled
        />
      </div>

      {/* Policy Information */}
      {question.policy && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <span className="font-medium">Policy:</span> {question.policy}
          </p>
        </div>
      )}

      {/* Corrective Actions */}
      {question.corrective_actions.length > 0 && (
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-800 font-medium mb-1">Corrective Actions:</p>
          <ul className="text-xs text-orange-700 space-y-1">
            {question.corrective_actions.map((action, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
