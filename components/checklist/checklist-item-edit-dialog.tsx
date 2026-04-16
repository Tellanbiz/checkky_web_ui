"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChecklistItemUpdateData } from "@/lib/services/checklist/models";

const questionTypes = [
  "Radiobutton List",
  "RadioButton",
  "Checkbox list",
  "CheckBoxList",
  "Text",
  "Memo",
  "Integer",
  "Decimal",
  "Date",
  "Time",
  "Signature",
  "Statement",
];

interface ChecklistItemEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: (ChecklistItemUpdateData & { policy: string | null }) | null;
  onSave: (data: ChecklistItemUpdateData) => void;
  isSaving?: boolean;
}

function listToText(values?: string[]) {
  return (values ?? []).filter(Boolean).join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ChecklistItemEditDialog({
  open,
  onOpenChange,
  question,
  onSave,
  isSaving = false,
}: ChecklistItemEditDialogProps) {
  const [questionGroup, setQuestionGroup] = useState("");
  const [caption, setCaption] = useState("");
  const [questionType, setQuestionType] = useState("Radiobutton List");
  const [defaultAnswer, setDefaultAnswer] = useState("");
  const [photoAvailable, setPhotoAvailable] = useState<"Yes" | "No">("No");
  const [answerOptionsText, setAnswerOptionsText] = useState("");
  const [correctiveOption, setCorrectiveOption] = useState("");
  const [correctiveActionsText, setCorrectiveActionsText] = useState("");
  const [policy, setPolicy] = useState("");

  useEffect(() => {
    if (!question) {
      return;
    }

    setQuestionGroup(question.question_group);
    setCaption(question.checklist_item_caption);
    setQuestionType(question.question_type || "Radiobutton List");
    setDefaultAnswer(question.default_answer ?? "");
    setPhotoAvailable(question.photo_available ?? "No");
    setAnswerOptionsText(listToText(question.answer_options));
    setCorrectiveOption(question.corrective_option ?? "");
    setCorrectiveActionsText(listToText(question.corrective_actions));
    setPolicy(question.policy ?? "");
  }, [question]);

  const answerOptions = useMemo(
    () => textToList(answerOptionsText),
    [answerOptionsText]
  );

  const handleSave = () => {
    if (!question) {
      return;
    }

    onSave({
      id: question.id,
      order_index: question.order_index,
      question_group: questionGroup,
      checklist_item_caption: caption,
      question_type: questionType,
      default_answer: defaultAnswer,
      photo_available: photoAvailable,
      answer_options: answerOptions,
      corrective_option: correctiveOption,
      corrective_actions: textToList(correctiveActionsText),
      policy,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit checklist item</DialogTitle>
          <DialogDescription>
            Customize this item for your organization and choose which answer should trigger corrective actions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="question-group">Section</Label>
            <Input
              id="question-group"
              value={questionGroup}
              onChange={(event) => setQuestionGroup(event.target.value)}
              className="bg-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="question-caption">Question</Label>
            <Textarea
              id="question-caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="min-h-24 bg-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Question type</Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Photo required</Label>
              <Select
                value={photoAvailable}
                onValueChange={(value) => setPhotoAvailable(value as "Yes" | "No")}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="default-answer">Default answer</Label>
            <Input
              id="default-answer"
              value={defaultAnswer}
              onChange={(event) => setDefaultAnswer(event.target.value)}
              className="bg-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="answer-options">Answer options</Label>
            <Textarea
              id="answer-options"
              value={answerOptionsText}
              onChange={(event) => setAnswerOptionsText(event.target.value)}
              placeholder="One option per line"
              className="min-h-28 bg-white"
            />
          </div>

          <div className="grid gap-2">
            <Label>Corrective option</Label>
            <Select
              value={correctiveOption || "__none"}
              onValueChange={(value) => setCorrectiveOption(value === "__none" ? "" : value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select trigger option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">No trigger</SelectItem>
                {answerOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="corrective-actions">Corrective actions</Label>
            <Textarea
              id="corrective-actions"
              value={correctiveActionsText}
              onChange={(event) => setCorrectiveActionsText(event.target.value)}
              placeholder="One corrective action per line"
              className="min-h-28 bg-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="policy">Policy</Label>
            <Textarea
              id="policy"
              value={policy}
              onChange={(event) => setPolicy(event.target.value)}
              className="min-h-24 bg-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
