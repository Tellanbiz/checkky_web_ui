"use client";

import { EditChecklistModal } from "@/components/modals/edit-checklist-modal";
import { OngoingChecklist } from "../../../components/checklist/ongoing-checklist";
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
    router.push("/dashboard/checklists");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header with Search */}
      <div className="flex flex-col gap-4">
        {/* Search and Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search checklists..."
              className="pl-10 bg-white w-full"
              onChange={(e) => ongoingActions.setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select onValueChange={ongoingActions.setStatus}>
              <SelectTrigger className="w-full sm:w-[140px] bg-white">
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
            <Button variant="outline" className="bg-white flex-1 sm:flex-none">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
            </Button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={() => assignChecklist()}
            variant="outline"
            className="w-full sm:w-auto justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Assign Checklist
          </Button>
          <Button
            onClick={() => handleNewChecklist()}
            className="w-full sm:w-auto justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Upload New Checklist</span>
            <span className="sm:hidden">New Checklist</span>
          </Button>
        </div>
      </div>

      {/* Ongoing Checklists Content */}
      <OngoingChecklist
        onEditChecklist={handleEditChecklist}
        onDeleteChecklist={handleDeleteChecklist}
        onViewDetails={handleViewDetails}
      />

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
