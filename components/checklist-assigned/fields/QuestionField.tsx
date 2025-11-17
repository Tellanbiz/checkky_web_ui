import { QuestionType } from '@/lib/services/checklist-assigned/models';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface QuestionFieldProps {
  question: {
    id: number;
    checklist_item_caption: string;
    question_type: QuestionType;
    default_answer: string | null;
    photo_available: string;
    answer_options: string[];
    corrective_actions: string[];
    policy: string | null;
    answer: string | null;
    is_answered: boolean;
  };
  value: string;
  onChange: (value: string) => void;
}

export function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  const renderField = () => {
    switch (question.question_type) {
      case QuestionType.Text:
      case QuestionType.Memo:
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.default_answer || ''}
            className="min-h-[100px] resize-none"
          />
        );

      case QuestionType.RadioButton:
      case QuestionType.RadiobuttonList:
        return (
          <RadioGroup
            value={value}
            onValueChange={onChange}
            className="space-y-3"
          >
            {question.answer_options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`radio-${question.id}-${index}`} />
                <Label
                  htmlFor={`radio-${question.id}-${index}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case QuestionType.CheckBoxList:
      case QuestionType.CheckboxList:
        const selectedValues = value ? value.split(',') : [];
        return (
          <div className="space-y-3">
            {question.answer_options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${question.id}-${index}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    let newValues: string[];
                    if (checked) {
                      newValues = [...selectedValues, option];
                    } else {
                      newValues = selectedValues.filter(v => v !== option);
                    }
                    onChange(newValues.join(','));
                  }}
                />
                <Label
                  htmlFor={`checkbox-${question.id}-${index}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case QuestionType.Date:
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case QuestionType.Time:
        return (
          <Input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case QuestionType.Integer:
        return (
          <Input
            type="number"
            step="1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case QuestionType.Decimal:
        return (
          <Input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case QuestionType.Statement:
        return (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-700">{question.checklist_item_caption}</p>
          </div>
        );

      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.default_answer || ''}
          />
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <Label className="text-sm font-medium leading-6">
          {question.checklist_item_caption}
          {question.is_answered && (
            <CheckCircle className="inline-block w-4 h-4 ml-2 text-green-600" />
          )}
        </Label>
        {question.photo_available === 'Yes' && (
          <Badge variant="outline" className="text-xs">
            Photo Required
          </Badge>
        )}
      </div>
      {renderField()}
      {question.policy && (
        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border-l-2 border-blue-200">
          <span className="font-medium">Policy:</span> {question.policy}
        </p>
      )}
      {question.corrective_actions.length > 0 && (
        <div className="text-xs text-gray-500 bg-orange-50 p-2 rounded border-l-2 border-orange-200">
          <span className="font-medium">Corrective Actions:</span> {question.corrective_actions.join(', ')}
        </div>
      )}
    </div>
  );
}
