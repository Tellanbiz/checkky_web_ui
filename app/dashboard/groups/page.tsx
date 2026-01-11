"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "@/lib/services/groups";
import type { Group, GroupParams } from "@/lib/services/groups";
import { DeleteConfirmationModal } from "@/components/team/delete-confirmation-modal";
import {
  GroupCard,
  GroupsHeader,
  GroupsEmptyState,
  GroupDialog,
} from "@/components/groups";

export default function GroupsPage() {
  return <GroupsPageContent />;
}

function GroupsPageContent() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-100 text-blue-800",
  });

  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: (data: GroupParams) => createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setFormData({
        name: "",
        description: "",
        color: "bg-blue-100 text-blue-800",
      });
      setIsAddDialogOpen(false);
      toast.success("Group added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GroupParams }) =>
      updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setFormData({
        name: "",
        description: "",
        color: "bg-blue-100 text-blue-800",
      });
      setIsEditDialogOpen(false);
      setSelectedGroup(null);
      toast.success("Group updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAddGroup = () => {
    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    createMutation.mutate({
      name: formData.name,
      description: formData.description,
    });
  };

  const handleEditGroup = () => {
    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (!selectedGroup) return;

    updateMutation.mutate({
      id: selectedGroup.id,
      data: {
        name: formData.name,
        description: formData.description,
      },
    });
  };

  const handleDeleteGroup = (group: Group) => {
    setGroupToDelete(group);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (groupToDelete) {
      deleteMutation.mutate(groupToDelete.id);
      setShowDeleteModal(false);
      setGroupToDelete(null);
    }
  };

  const openEditDialog = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      color: "bg-blue-100 text-blue-800", // Default color, not used in dialog
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "bg-blue-100 text-blue-800",
    });
    setSelectedGroup(null);
  };

  // Filter and sort groups
  const filteredGroups = (Array.isArray(groups) ? groups : [])
    .filter((group) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          group.name.toLowerCase().includes(searchLower) ||
          group.description?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "checklists":
          return b.no_of_checklists - a.no_of_checklists;
        default:
          return 0;
      }
    });

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Error loading groups</p>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading groups...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 pt-6">
      {/* Header */}
      <GroupsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onAddGroup={() => setIsAddDialogOpen(true)}
      />

      {/* Groups Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onEdit={openEditDialog}
            onDelete={handleDeleteGroup}
            isUpdatePending={updateMutation.isPending}
            isDeletePending={deleteMutation.isPending}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <GroupsEmptyState
          searchTerm={searchTerm}
          onAddGroup={() => setIsAddDialogOpen(true)}
        />
      )}

      {/* Add Group Dialog */}
      <GroupDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          resetForm();
        }}
        onSubmit={handleAddGroup}
        title="Add New Group"
        submitText="Add Group"
        formData={formData}
        onFormDataChange={setFormData}
        isPending={createMutation.isPending}
      />

      {/* Edit Group Dialog */}
      <GroupDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          resetForm();
        }}
        onSubmit={handleEditGroup}
        title="Edit Group"
        submitText="Update Group"
        formData={formData}
        onFormDataChange={setFormData}
        isPending={updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Group"
        description="Are you sure you want to delete this group? All associated checklists will be affected."
        itemName={groupToDelete?.name || ""}
      />
    </div>
  );
}
