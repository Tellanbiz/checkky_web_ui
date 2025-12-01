"use client";

import { Badge } from "@/components/ui/badge";
import { PlayCircle, PauseCircle } from "lucide-react";
import { WorkspaceInfo } from "@/lib/services/workflows/models";

const priorityColors = {
  high: "bg-red-100 text-red-800",
  mid: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const statusColors = {
  running: "bg-green-100 text-green-800",
  stopped: "bg-gray-100 text-gray-800",
};

interface WorkflowStatusSectionProps {
  workflow: WorkspaceInfo;
}

export function WorkflowStatusSection({
  workflow,
}: WorkflowStatusSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Status & Priority
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Current workflow status and priority level for execution and
        monitoring.
      </p>
      <div className="flex items-center space-x-4">
        <Badge className={statusColors[workflow.status]}>
          {workflow.status === "running" ? (
            <>
              <PlayCircle className="mr-1 h-3 w-3" />
              Running
            </>
          ) : (
            <>
              <PauseCircle className="mr-1 h-3 w-3" />
              Stopped
            </>
          )}
        </Badge>
        <Badge className={priorityColors[workflow.priority]}>
          {workflow.priority} priority
        </Badge>
      </div>
      <p className="mt-4 text-gray-600">
        {workflow.notes || "No description provided"}
      </p>
    </div>
  );
}
