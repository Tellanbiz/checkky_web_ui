'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface NumericInputWidgetProps {
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
  isDecimal?: boolean;
}

export function NumericInputWidget({
  question,
  value,
  onAnswerChanged,
  onCommentChanged,
  onGalleryPressed,
  onCameraPressed,
  isDecimal = false
}: NumericInputWidgetProps) {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    onCommentChanged(newComment);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input or valid numeric values
    if (inputValue === '' || (isDecimal ? !isNaN(parseFloat(inputValue)) : !isNaN(parseInt(inputValue)))) {
      onAnswerChanged(inputValue);
    }
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

      {/* Numeric Input */}
      <div className="space-y-2">
        <Input
          type="number"
          step={isDecimal ? "0.01" : "1"}
          value={value}
          onChange={handleInputChange}
          placeholder={question.default_answer || `Enter ${isDecimal ? 'decimal' : 'whole'} number...`}
          className="w-full text-gray-900"
          disabled
        />
        {isDecimal && (
          <p className="text-xs text-gray-500">Enter a decimal number (e.g., 12.34)</p>
        )}
        {!isDecimal && (
          <p className="text-xs text-gray-500">Enter a whole number (e.g., 42)</p>
        )}
      </div>

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
