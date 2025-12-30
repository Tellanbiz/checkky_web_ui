"use client";

import { EditChecklistModal } from "@/components/modals/edit-checklist-modal";
import { OngoingChecklist } from "../../../components/checklist/ongoing-checklist";
import { CompletedChecklists } from "../../../components/checklist/completed_checklists";
import { ChecklistTabNavigation } from "../../../components/checklist/navigation/tab-navigation";
import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');

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

  return (
    <div className="">
      {/* Tab Navigation */}
      <ChecklistTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
          </div>

        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 md:px-8 pb-8">
        {activeTab === 'ongoing' ? (
          <OngoingChecklist
            onEditChecklist={handleEditChecklist}
            onDeleteChecklist={handleDeleteChecklist}
            onViewDetails={handleViewDetails}
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
