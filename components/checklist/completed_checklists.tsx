"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AssignedChecklist } from "@/lib/services/checklist/models";
import { useAssignedChecklists } from "@/lib/services/checklist/hooks";
import { OngoingChecklistCard } from "./ongoing-checklist-card";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface CompletedChecklistsProps {
  onEditChecklist?: (checklist: any) => void;
  onDeleteChecklist?: (checklist: any) => void;
  onViewDetails?: (checklist: any) => void;
}

export function CompletedChecklists({
  onEditChecklist,
  onDeleteChecklist,
  onViewDetails,
}: CompletedChecklistsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedChecklist, setSelectedChecklist] =
    useState<AssignedChecklist | null>(null);

  // Use TanStack Query to fetch completed checklists
  const { data: checklists = [], isLoading, error, refetch } = useAssignedChecklists("completed");

  const handleChecklistClick = (checklist: AssignedChecklist) => {
    router.push(`/dashboard/checklists/answers/${checklist.id}`);
  };

  const handleDeleteChecklist = (checklist: AssignedChecklist) => {
    onDeleteChecklist?.(checklist);
  };

  // Mock drag handlers for completed checklists (no drag functionality needed)
  const handleDragStart = () => {};
  const handleDragEnd = () => {};
  const handleDrop = () => {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <Button onClick={() => refetch()} disabled={isLoading}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
 

      {/* Grid Layout */}
      {checklists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {checklists.map((checklist) => (
            <OngoingChecklistCard
              key={checklist.id}
              checklist={checklist}
              onClick={handleChecklistClick}
              onDeleteChecklist={handleDeleteChecklist}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDrop={handleDrop}
              draggedItem={null}
              updatingIds={new Set()}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No completed checklists
          </h3>
          <p className="text-gray-600">
            Checklists that have been completed will appear here.
          </p>
        </div>
      )}
    </div>
  );
}