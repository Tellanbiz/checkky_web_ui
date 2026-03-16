"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Loader2,
  ArrowRight,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getAllChecklists } from "@/lib/services/checklist/actions";
import { CheckList } from "@/lib/services/checklist/models";
import { useRouter } from "next/navigation";
import { useAvailableFilters } from "@/lib/provider/checklists/index";
import { useDeleteUploadedChecklist } from "@/lib/services/checklist";
import { DeleteConfirmationModal } from "@/components/team/delete-confirmation-modal";
import { useState } from "react";

export function AvailableChecklist() {
  const { toast } = useToast();
  const router = useRouter();
  const filters = useAvailableFilters();
  const deleteChecklistMutation = useDeleteUploadedChecklist();
  const [checklistToDelete, setChecklistToDelete] = useState<CheckList | null>(
    null,
  );

  // TanStack Query for fetching checklists
  const {
    data: checklists = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checklists"],
    queryFn: () => getAllChecklists(),
    staleTime: 0, // Disable cache - always fetch fresh data
    retry: 2,
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load available checklists. Please try again.",
      variant: "destructive",
    });
  }

  // Apply filters and sorting
  const filteredAndSortedChecklists = checklists
    .filter((checklist: { name: string; description: string }) => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const nameMatch = checklist.name.toLowerCase().includes(searchLower);
        const descriptionMatch = checklist.description
          ?.toLowerCase()
          .includes(searchLower);
        if (!nameMatch && !descriptionMatch) {
          return false;
        }
      }

      // Category filter (if available in checklist data)
      if (filters.category !== "all") {
        // Add category filtering logic here if checklist has category field
      }

      return true;
    })
    .sort(
      (
        a: { created_at: string | number | Date; name: string },
        b: { created_at: string | number | Date; name: any },
      ) => {
        switch (filters.sortBy) {
          case "recent":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      },
    );

  const handleViewChecklist = (checklist: CheckList) => {
    router.push(`/dashboard/checklists/${checklist.id}`);
  };

  const handleDeleteChecklist = async () => {
    if (!checklistToDelete) {
      return;
    }

    try {
      await deleteChecklistMutation.mutateAsync(checklistToDelete.id);
      toast({
        title: "Checklist deleted",
        description: `"${checklistToDelete.name}" has been removed from your uploaded checklists.`,
      });
      setChecklistToDelete(null);
    } catch (error) {
      toast({
        title: "Unable to delete checklist",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    // Convert UTC to local time and format as "12 January 2025"
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC", // Keep it UTC but format nicely
      })
      .replace(",", "");
  };

  return (
    <div className="space-y-4">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Loading checklists...
          </span>
        </div>
      )}

      {/* Available Checklists Grid */}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedChecklists.map((checklist: CheckList) => (
            <button
              key={checklist.id}
              className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer overflow-hidden text-left w-full hover:bg-gray-50"
              onClick={() => handleViewChecklist(checklist)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-800"
                      >
                        {checklist.category.replaceAll("_", " ")}
                      </Badge>
                      {checklist.can_delete && (
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-50 text-amber-700"
                        >
                          <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                          Uploaded by you
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {checklist.name}
                    </h3>
                    {checklist.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1.5">
                        {checklist.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    {checklist.can_delete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          setChecklistToDelete(checklist);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {checklist.section_count}
                    </span>
                    <span>sections</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {checklist.item_count}
                    </span>
                    <span>items</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {formatDate(checklist.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty State (if no checklists) */}
      {!isLoading && filteredAndSortedChecklists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No available checklists</p>
            <p className="text-sm">
              {filters.searchTerm
                ? `No checklists found for "${filters.searchTerm}"`
                : "Check back later for new templates and standards."}
            </p>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!checklistToDelete}
        onClose={() => setChecklistToDelete(null)}
        onConfirm={handleDeleteChecklist}
        title="Delete Uploaded Checklist"
        description="This removes the checklist template and any assigned copies that depend on it."
        itemName={checklistToDelete?.name || ""}
      />
    </div>
  );
}
