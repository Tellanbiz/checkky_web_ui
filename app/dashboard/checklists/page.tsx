"use client";

import { EditChecklistModal } from "../components/modals/edit-checklist-modal";
import { DeleteConfirmationModal } from "../components/modals/delete-confirmation-modal";
import { NewChecklistModal } from "../../../components/checklist/new-checklist-modal";
import { OngoingChecklist } from "../../../components/checklist/ongoing-checklist";
import { AvailableChecklist } from "../../../components/checklist/available-checklist";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChecklistDetailsModal } from "../components/modals/checklist-details-modal";

export default function ChecklistsPage() {
  const { toast } = useToast();
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
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
    toast({
      title: "Delete Confirmation",
      description: `Preparing to delete: ${checklist.title}`,
      variant: "destructive",
    });
  };

  const confirmDelete = () => {
    if (checklistToDelete) {
      // Here you would actually delete the checklist
      toast({
        title: "Checklist Deleted",
        description: `${checklistToDelete.title} has been deleted successfully.`,
      });
      setShowDeleteModal(false);
      setChecklistToDelete(null);
    }
  };

  const handleViewDetails = (checklist: any) => {
    setSelectedChecklistForDetails(checklist);
    setShowDetailsModal(true);
    toast({
      title: "Viewing Details",
      description: `Opening details for: ${checklist.title}`,
    });
  };

  const handleNewChecklist = () => {
    setShowNewModal(true);
    toast({
      title: "Create New Checklist",
      description: "Opening checklist creation form...",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Checklists</h2>
        <Button onClick={() => handleNewChecklist()}>
          <Plus className="mr-2 h-4 w-4" />
          New Checklist
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ongoing" className="space-y-4">
        <TabsList className="w-fit">
          <TabsTrigger value="ongoing" className="px-6">
            Ongoing Checklists
          </TabsTrigger>
          <TabsTrigger value="available" className="px-6">
            Available Checklists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="space-y-4">
          <OngoingChecklist
            onEditChecklist={handleEditChecklist}
            onDeleteChecklist={handleDeleteChecklist}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <AvailableChecklist />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NewChecklistModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
      />

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
