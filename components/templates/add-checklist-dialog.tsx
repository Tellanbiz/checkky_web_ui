import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PublicChecklist } from "@/lib/services/checklist/models";

interface AddChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: PublicChecklist | null;
  onConfirm: (title: string, description: string) => Promise<void>;
  isSubmitting: boolean;
}

export function AddChecklistDialog({
  open,
  onOpenChange,
  template,
  onConfirm,
  isSubmitting,
}: AddChecklistDialogProps) {
  const [checklistTitle, setChecklistTitle] = useState("");
  const [checklistDescription, setChecklistDescription] = useState("");

  // Reset form when template changes
  useEffect(() => {
    if (template) {
      setChecklistTitle(template.name);
      setChecklistDescription(template.description || "");
    }
  }, [template]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && template) {
      setChecklistTitle(template.name);
      setChecklistDescription(template.description || "");
    }
    onOpenChange(newOpen);
  };

  const handleConfirm = async () => {
    if (!checklistTitle.trim()) return;
    
    await onConfirm(checklistTitle, checklistDescription);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Copy Template to Checklist</DialogTitle>
          <DialogDescription>
            Create a copy of this template with your own title and description.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Template Info */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            {template?.description && (
              <p className="text-xs text-gray-600 mb-3">{template.description}</p>
            )}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="font-medium">{template?.section_count}</span> sections
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium">{template?.item_count}</span> items
              </span>
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">
              Title *
            </label>
            <Input
              value={checklistTitle}
              onChange={(e) => setChecklistTitle(e.target.value)}
              placeholder="Enter a title for your checklist..."
              className="w-full h-11"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">
              Description
            </label>
            <textarea
              value={checklistDescription}
              onChange={(e) => setChecklistDescription(e.target.value)}
              placeholder="Add any notes, requirements, or context for this checklist..."
              className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-8 h-10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!checklistTitle.trim() || isSubmitting}
            className="px-8 h-10"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Copying...
              </>
            ) : (
              "Copy to Checklist"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
