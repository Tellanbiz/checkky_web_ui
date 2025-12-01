"use client";

import { EditChecklistModal } from "@/components/modals/edit-checklist-modal";
import { OngoingChecklist } from "../../../components/checklist/ongoing-checklist";
import { AvailableChecklist } from "../../../components/checklist/available-checklist";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ChecklistDetailsModal } from "@/components/modals/checklist-details-modal";
import { DeleteConfirmationModal } from "@/components/team/delete-confirmation-modal";
import { useOngoingFilterActions, useAvailableFilterActions, useChecklistFilterStore } from "@/lib/provider/checklists/index";

export default function ChecklistsPage() {
  return <ChecklistsPageContent />;
}

function ChecklistsPageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const ongoingActions = useOngoingFilterActions();
  const availableActions = useAvailableFilterActions();
  const { deleteChecklist } = useChecklistFilterStore();
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedChecklistForDetails, setSelectedChecklistForDetails] =
    useState<any>(null);
  const [activeTab, setActiveTab] = useState("ongoing");

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="w-fit">
            <TabsTrigger value="ongoing" className="px-6">
              Ongoing Checklists
            </TabsTrigger>
            <TabsTrigger value="available" className="px-6">
              Availabe Checklist
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4">
            {/* Tab-specific Filters */}
            {activeTab === "ongoing" && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search checklists..."
                    className="pl-10 bg-white"
                    onChange={(e) => ongoingActions.setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <Select onValueChange={ongoingActions.setStatus}>
                    <SelectTrigger className="w-[140px] bg-white">
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
                  <Button variant="outline" className="bg-white">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "available" && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search checklists..."
                    className="pl-10 bg-white"
                    onChange={(e) => availableActions.setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button variant="outline" className="bg-white">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
            )}

              <Button onClick={() => handleNewChecklist()}>
                <Plus className="mr-2 h-4 w-4" />
                Upload New Checklist
              </Button>
          </div>
        </div>

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
