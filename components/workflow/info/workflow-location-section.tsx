"use client";

import { WorkspaceInfo } from "@/lib/services/workflows/models";

interface WorkflowLocationSectionProps {
  workflow: WorkspaceInfo;
}

export function WorkflowLocationSection({
  workflow,
}: WorkflowLocationSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Location Information
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Geographic location and section details where this workflow is
        assigned to run.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Section Name
          </label>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {workflow.section.name}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Location
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {workflow.section.location}
          </p>
        </div>
      </div>
    </div>
  );
}
