'use client';

import { QuestionType, AuditScore } from '@/lib/services/checklist-assigned/models';
import { FormWithAttachment } from './FormWithAttachment';
import { TextInputWidget } from './TextInputWidget';
import { RadioButtonWidget } from './RadioButtonWidget';
import { CheckboxListWidget } from './CheckboxListWidget';
import { NumericInputWidget } from './NumericInputWidget';
import { DateInputWidget } from './DateInputWidget';
import { TimeInputWidget } from './TimeInputWidget';
import { SignatureInputWidget } from './SignatureInputWidget';
import { AuditScoreWidget } from './AuditScoreWidget';

interface QuestionWidgetFactoryProps {
  question: {
    id: number;
    question_type: QuestionType;
    checklist_item_caption: string;
    default_answer: string | null;
    photo_available: string;
    answer_options: string[];
    corrective_actions: string[];
    policy: string | null;
    answer: string | null;
    is_answered: boolean;
    score: AuditScore;
    perc_score: number;
    checklist_answer_id?: string;
  };
  value: string;
  onAnswerChanged: (value: string | null) => void;
  onCommentChanged: (comment: string) => void;
  photoUrl?: string | null;
  auditScore: AuditScore;
  onAuditScoreChange: (score: AuditScore) => void;
  checklistStatus: 'pending' | 'in_progress' | 'completed';
}

export function QuestionWidgetFactory({
  question,
  value,
  onAnswerChanged,
  onCommentChanged,
  photoUrl,
  auditScore,
  onAuditScoreChange,
  checklistStatus
}: QuestionWidgetFactoryProps) {
  const hasAttachment = question.photo_available.toLowerCase() === 'yes';

  switch (question.question_type) {
    case QuestionType.RadioButton:
    case QuestionType.RadiobuttonList:
      return (
        <FormWithAttachment
          hasAttachment={hasAttachment}
          photoUrl={photoUrl}
        >
          <RadioButtonWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </FormWithAttachment>
      );

    case QuestionType.Text:
    case QuestionType.Memo:
      return (
        <FormWithAttachment
          hasAttachment={hasAttachment}
          photoUrl={photoUrl}
        >
          <TextInputWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </FormWithAttachment>
      );

    case QuestionType.CheckBoxList:
    case QuestionType.CheckboxList:
    case QuestionType.CorrectiveActionMulti:
    case QuestionType.CorrectiveMulti:
      return (
        <FormWithAttachment
          hasAttachment={hasAttachment}
          photoUrl={photoUrl}
        >
          <CheckboxListWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </FormWithAttachment>
      );

    case QuestionType.Integer:
      return (
        <FormWithAttachment
          hasAttachment={hasAttachment}
          photoUrl={photoUrl}
        >
          <NumericInputWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
            isDecimal={false}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </FormWithAttachment>
      );

    case QuestionType.Decimal:
      return (
        <FormWithAttachment
          hasAttachment={hasAttachment}
          photoUrl={photoUrl}
        >
          <NumericInputWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
            isDecimal={true}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </FormWithAttachment>
      );

    case QuestionType.Date:
      return (
        <FormWithAttachment
          hasAttachment={hasAttachment}
          photoUrl={photoUrl}
        >
          <DateInputWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </FormWithAttachment>
      );

    case QuestionType.Time:
      return (
        <FormWithAttachment
          hasAttachment={hasAttachment}
          photoUrl={photoUrl}
        >
          <TimeInputWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </FormWithAttachment>
      );

    case QuestionType.Signature:
      return (
        <div>
          <SignatureInputWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </div>
      );

    // For complex types not yet implemented, fall back to text input
    case QuestionType.SmartView:
    case QuestionType.Table:
    case QuestionType.Matrix:
    case QuestionType.ItemList:
    case QuestionType.ManagedList:
    case QuestionType.RecordList:
    case QuestionType.Supplier:
    case QuestionType.Temperature:
    case QuestionType.Statement:
    default:
      return (
        <FormWithAttachment
          hasAttachment={hasAttachment}
          photoUrl={photoUrl}
        >
          <TextInputWidget
            question={question}
            value={value}
            onAnswerChanged={onAnswerChanged}
            onCommentChanged={onCommentChanged}
            onGalleryPressed={() => {}}
            onCameraPressed={() => {}}
          />
          <AuditScoreWidget
            auditScore={auditScore}
            onAuditScoreChange={onAuditScoreChange}
            disabled={false}
            questionId={question.id}
            checklistAnswerId={question.checklist_answer_id}
            checklistStatus={checklistStatus}
            hasAnswer={!!question.answer}
          />
        </FormWithAttachment>
      );
  }
}
