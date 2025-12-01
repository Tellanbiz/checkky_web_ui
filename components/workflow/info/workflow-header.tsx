"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Edit, Trash2 } from "lucide-react";
import { WorkspaceInfo } from "@/lib/services/workflows/models";

interface WorkflowHeaderProps {
  workflow: WorkspaceInfo;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function WorkflowHeader({
  workflow,
  onEdit,
  onDelete,
  onToggleStatus,
}: WorkflowHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {workflow.title}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Workflow
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Workflow
            </Button>
            <Button onClick={onToggleStatus}>
              {workflow.status === "running" ? (
                <>
                  <PauseCircle className="mr-2 h-4 w-4" />
                  Pause Workflow
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Workflow
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
