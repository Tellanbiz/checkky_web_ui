import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Group } from "@/lib/services/groups";

interface GroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  submitText: string;
  formData: {
    name: string;
    description: string;
    color: string;
    parent_group_id: string;
  };
  onFormDataChange: (data: {
    name: string;
    description: string;
    color: string;
    parent_group_id: string;
  }) => void;
  isPending: boolean;
  groups: Group[];
  currentGroupId?: string | null;
}

export function GroupDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText,
  formData,
  onFormDataChange,
  isPending,
  groups,
  currentGroupId,
}: GroupDialogProps) {
  const availableParents = groups
    .filter((group) => group.id !== currentGroupId)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              placeholder="Enter group name"
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent-group">Parent Group</Label>
            <Select
              value={formData.parent_group_id || "none"}
              onValueChange={(value) =>
                onFormDataChange({
                  ...formData,
                  parent_group_id: value === "none" ? "" : value,
                })
              }
              disabled={isPending}
            >
              <SelectTrigger id="parent-group">
                <SelectValue placeholder="No parent (top level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent (top level)</SelectItem>
                {availableParents.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
