import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AssignedChecklist } from "@/lib/services/checklist/models";
import {
  useOngoingFilters,
  useChecklistFilterStore,
} from "@/lib/provider/checklists/index";
import {
  useAssignedChecklists,
  useUpdateChecklistPriority,
} from "@/lib/services/checklist/hooks";
import { OngoingChecklistCard } from "./ongoing-checklist-card";
import { OngoingSidebar } from "./ongoing-sidebar";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface OngoingChecklistProps {
  onEditChecklist: (checklist: any) => void;
  onDeleteChecklist: (checklist: any) => void;
  onViewDetails: (checklist: any) => void;
  groupId?: string | null;
}

const getPriorityDisplayName = (priority: string) => {
  switch (priority) {
    case "high":
      return "Major Must";
    case "mid":
      return "Minor Must";
    case "low":
      return "Low Priority";
    default:
      return priority;
  }
};

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "mid":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

export function OngoingChecklist({
  onEditChecklist,
  onDeleteChecklist,
  onViewDetails,
  groupId,
}: OngoingChecklistProps) {
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedChecklist, setSelectedChecklist] =
    useState<AssignedChecklist | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Get filter state
  const filters = useOngoingFilters();

  // Use TanStack Query to fetch pending checklists
  const {
    data: checklists = [],
    isLoading,
    error,
    refetch,
  } = useAssignedChecklists("pending");

  // Mutation for updating priority
  const updatePriorityMutation = useUpdateChecklistPriority();

  const handleDragStart = (e: React.DragEvent, checklistId: string) => {
    setDraggedItem(checklistId);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (
    e: React.DragEvent,
    newPriority: "high" | "mid" | "low",
  ) => {
    e.preventDefault();

    if (!draggedItem) return;

    setIsDragging(false);
    const checklistId = draggedItem;
    setDraggedItem(null);

    try {
      await updatePriorityMutation.mutateAsync({ checklistId, newPriority });
      toast({
        title: "Priority Updated",
        description: `Checklist moved to ${getPriorityDisplayName(
          newPriority,
        )}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update priority. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragging(false);
  };

  // Apply filters to checklists (status is already filtered by the query)
  const filteredChecklists = checklists.filter((checklist) => {
    if (groupId && groupId !== "all") {
      if (groupId === "none") {
        if (checklist.group_id) {
          return false;
        }
      } else if (String(checklist.group_id) !== groupId) {
        return false;
      }
    }

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const titleMatch = checklist.title.toLowerCase().includes(searchLower);
      const notesMatch = checklist.notes?.toLowerCase().includes(searchLower);
      const assigneeMatch = checklist.assigned_member?.name
        .toLowerCase()
        .includes(searchLower);
      if (!titleMatch && !notesMatch && !assigneeMatch) {
        return false;
      }
    }

    // Category filter (if available in checklist data)
    if (filters.category !== "all") {
      // Add category filtering logic here if checklist has category field
    }

    return true;
  });

  const getChecklistsByPriority = (priority: "high" | "mid" | "low") => {
    return filteredChecklists.filter(
      (checklist) => checklist.priority === priority,
    );
  };

  const getColumnStyles = (priority: "high" | "mid" | "low") => {
    return "border-gray-200 bg-white";
  };

  const getColumnHeaderStyles = (priority: "high" | "mid" | "low") => {
    return "bg-gray-50 border-gray-200 text-gray-700";
  };

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
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
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
      {/* Drag and Drop Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {(["high", "mid", "low"] as const).map((priority) => {
          const priorityChecklists = getChecklistsByPriority(priority);

          return (
            <div
              key={priority}
              className={`rounded-lg border ${getColumnStyles(priority)} ${
                isDragging ? "border-blue-300 bg-blue-50" : "border-gray-200"
              } h-full min-h-[400px]`}
            >
              {/* Column Header */}
              <div
                className={`p-3 border-b ${getColumnHeaderStyles(
                  priority,
                )} rounded-t-lg`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm sm:text-base">
                    {getPriorityDisplayName(priority)}
                  </h3>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {priorityChecklists.length}
                  </Badge>
                </div>
              </div>

              {/* Column Content */}
              <div
                className="p-2.5 space-y-2.5 overflow-y-auto max-h-[600px]"
                onDrop={(e) => handleDrop(e, priority)}
                onDragOver={handleDragOver}
              >
                {priorityChecklists.map((checklist) => (
                  <OngoingChecklistCard
                    key={checklist.id}
                    checklist={checklist}
                    onClick={(checklist) => {
                      setSelectedChecklist(checklist);
                      setShowSidebar(true);
                    }}
                    onDeleteChecklist={onDeleteChecklist}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    handleDrop={handleDrop}
                    draggedItem={draggedItem}
                    updatingIds={
                      updatePriorityMutation.isPending && draggedItem
                        ? new Set([draggedItem])
                        : new Set()
                    }
                  />
                ))}

                {priorityChecklists.length === 0 && (
                  <div
                    className="text-center py-6 sm:py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg"
                    onDrop={(e) => handleDrop(e, priority)}
                    onDragOver={handleDragOver}
                  >
                    <p className="text-sm">No checklists</p>
                    <p className="text-xs mt-1">Drag checklists here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar */}
      <OngoingSidebar
        checklist={selectedChecklist}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onCompleteChecklist={(checklist) => {
          // Handle completing the checklist
          toast({
            title: "Complete Checklist",
            description: `Completing: ${checklist.title}`,
          });
          // You can add navigation or API call here
        }}
      />
    </div>
  );
}
