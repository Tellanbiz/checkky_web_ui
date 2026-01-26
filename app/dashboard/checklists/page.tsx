"use client";

import { EditChecklistModal } from "@/components/modals/edit-checklist-modal";
import { OngoingChecklist } from "../../../components/checklist/ongoing-checklist";
import { CompletedChecklists } from "../../../components/checklist/completed_checklists";
import { ChecklistTabNavigation } from "../../../components/checklist/navigation/tab-navigation";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ChecklistDetailsModal } from "@/components/modals/checklist-details-modal";
import { DeleteConfirmationModal } from "@/components/team/delete-confirmation-modal";
import {
  useOngoingFilterActions,
  useChecklistFilterStore,
} from "@/lib/provider/checklists/index";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/services/groups";
import { buildGroupTree } from "@/lib/utils/group-tree";
import type { GroupTreeNode } from "@/lib/utils/group-tree";

export default function ChecklistsPage() {
  return <ChecklistsPageContent />;
}

function ChecklistsPageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const ongoingActions = useOngoingFilterActions();
  const { deleteChecklist } = useChecklistFilterStore();
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedChecklistForDetails, setSelectedChecklistForDetails] =
    useState<any>(null);
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing",
  );
  const searchParams = useSearchParams();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Sync selectedGroupId with URL query parameter
  useEffect(() => {
    const groupParam = searchParams.get("group");
    if (groupParam) {
      setSelectedGroupId(groupParam);
    }
  }, [searchParams]);

  // Sync activeTab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "completed") {
      setActiveTab("completed");
    } else {
      setActiveTab("ongoing");
    }
  }, [searchParams]);

  const { data: groups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5,
  });

  const groupTree = buildGroupTree(groups);

  const renderGroupOption = (
    node: GroupTreeNode,
    depth: number = 0,
  ): React.JSX.Element[] => {
    const indent = "\u00A0\u00A0".repeat(depth);
    const result: React.JSX.Element[] = [
      <SelectItem key={node.group.id} value={node.group.id}>
        {indent}
        {depth > 0 && "└ "}
        {node.group.name} ({node.group.no_of_checklists})
      </SelectItem>,
    ];
    node.children.forEach((child) => {
      result.push(...renderGroupOption(child, depth + 1));
    });
    return result;
  };

  const handleEditChecklist = (checklist: any) => {
    setSelectedChecklist(checklist);
    setShowEditModal(true);
    toast({
      title: "Edit Mode",
      description: `Editing checklist: ${checklist.title}`,
    });
  };

  const handleDeleteChecklist = (checklist: any) => {
    setChecklistToDelete(checklist);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (checklistToDelete) {
      try {
        await deleteChecklist(checklistToDelete.id);
        toast({
          title: "Checklist Deleted",
          description: `${checklistToDelete.title} has been deleted successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete checklist. Please try again.",
          variant: "destructive",
        });
      }
      setShowDeleteModal(false);
      setChecklistToDelete(null);
    }
  };

  const handleViewDetails = (checklist: any) => {
    setSelectedChecklistForDetails(checklist);
    setShowDetailsModal(true);
  };

  const handleNewChecklist = () => {
    router.push("/dashboard/checklists/new");
  };

  const assignChecklist = () => {
    router.push("/dashboard/checklists/available");
  };

  const handleTabChange = (tab: "ongoing" | "completed") => {
    setActiveTab(tab);
    // Update URL query parameter
    const url = new URL(window.location.href);
    if (tab === "completed") {
      url.searchParams.set("tab", "completed");
    } else {
      url.searchParams.delete("tab");
    }
    router.replace(url.pathname + url.search);
  };

  return (
    <div className="">
      {/* Tab Navigation */}
      <ChecklistTabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAssignChecklist={assignChecklist}
        onUploadChecklist={handleNewChecklist}
      />

      {/* Header with Search */}
      <div className="flex flex-col gap-4 p-4 md:p-8 pt-6">
        {/* Search, Filters and Action Buttons Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4">
          <div className="relative w-full lg:max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search checklists..."
              className="pl-10 bg-white w-full"
              onChange={(e) => ongoingActions.setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <Select onValueChange={ongoingActions.setStatus}>
              <SelectTrigger className="w-full lg:w-[140px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedGroupId || "all"}
              onValueChange={(value) => {
                const newValue = value === "all" ? null : value;
                setSelectedGroupId(newValue);
                // Update URL to reflect the filter
                if (newValue) {
                  router.push(`/dashboard/checklists?group=${newValue}`);
                } else {
                  router.push("/dashboard/checklists");
                }
              }}
            >
              <SelectTrigger className="w-full lg:w-[180px] bg-white">
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="none">No Group</SelectItem>
                {groupTree.map((node) => renderGroupOption(node))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 md:px-8 pb-8">
        {activeTab === "ongoing" ? (
          <OngoingChecklist
            onEditChecklist={handleEditChecklist}
            onDeleteChecklist={handleDeleteChecklist}
            onViewDetails={handleViewDetails}
            groupId={selectedGroupId}
          />
        ) : (
          <CompletedChecklists
            onEditChecklist={handleEditChecklist}
            onDeleteChecklist={handleDeleteChecklist}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      {/* Modals */}
      {selectedChecklist && (
        <EditChecklistModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          checklist={selectedChecklist}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Checklist"
        description="Are you sure you want to delete this checklist? All associated data will be permanently removed."
        itemName={checklistToDelete?.title || ""}
      />

      {selectedChecklistForDetails && (
        <ChecklistDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          checklist={selectedChecklistForDetails}
        />
      )}
    </div>
  );
}
