"use client";

import { WorkspaceInfo } from "@/lib/services/workflows/models";

interface WorkflowChecklistSectionProps {
  workflow: WorkspaceInfo;
}

export function WorkflowChecklistSection({
  workflow,
}: WorkflowChecklistSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Checklist Information
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        The checklist template that defines the tasks and procedures for
        this workflow.
      </p>
      <div>
        <label className="text-sm font-medium text-gray-500">
          Checklist
        </label>
        <p className="mt-1 text-sm font-medium text-gray-900">
          {workflow.checklist.name}
        </p>
        {workflow.checklist.description && (
          <p className="mt-1 text-xs text-gray-500">
            {workflow.checklist.description}
          </p>
        )}
      </div>
    </div>
  );
}
