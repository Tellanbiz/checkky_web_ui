"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle } from "lucide-react";

interface StatusToggleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentStatus: 'running' | 'stopped';
  workflowTitle?: string;
}

export function StatusToggleDialog({
  open,
  onOpenChange,
  onConfirm,
  currentStatus,
  workflowTitle,
}: StatusToggleDialogProps) {
  const isStarting = currentStatus === 'stopped';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isStarting ? (
              <>
                <PlayCircle className="h-5 w-5 text-green-600" />
                Start Workflow
              </>
            ) : (
              <>
                <PauseCircle className="h-5 w-5 text-yellow-600" />
                Pause Workflow
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {workflowTitle && `Are you sure you want to ${isStarting ? 'start' : 'pause'} "${workflowTitle}"? `}
            {isStarting 
              ? "This will begin the automated execution of this workflow according to its schedule."
              : "This will temporarily halt the automated execution of this workflow. You can start it again later."
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant={isStarting ? "default" : "secondary"}
            onClick={onConfirm}
          >
            {isStarting ? 'Start' : 'Pause'} Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
