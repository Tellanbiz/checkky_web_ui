"use client";

import React, { useState } from "react";
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
import { buildGroupTree } from "@/lib/utils/group-tree";
import type { GroupTreeNode } from "@/lib/utils/group-tree";

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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-100 text-blue-800",
    parent_group_id: "",
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
        parent_group_id: "",
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
        parent_group_id: "",
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
      parent_group_id: formData.parent_group_id
        ? Number(formData.parent_group_id)
        : undefined,
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
        parent_group_id: formData.parent_group_id
          ? Number(formData.parent_group_id)
          : undefined,
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
      parent_group_id: group.parent_group_id ?? "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "bg-blue-100 text-blue-800",
      parent_group_id: "",
    });
    setSelectedGroup(null);
  };

  // Filter and sort groups
  const filteredGroups = (Array.isArray(groups) ? groups : []).filter(
    (group) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          group.name.toLowerCase().includes(searchLower) ||
          group.description?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    },
  );

  // Build hierarchical tree
  const groupTree = buildGroupTree(filteredGroups, (a, b) => {
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

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const renderGroupNode = (node: GroupTreeNode, depth: number = 0) => {
    const isExpanded = expandedGroups.has(node.group.id);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.group.id} className="space-y-2">
        <div style={{ paddingLeft: `${depth * 1.5}rem` }}>
          <GroupCard
            group={node.group}
            onEdit={openEditDialog}
            onDelete={handleDeleteGroup}
            isUpdatePending={updateMutation.isPending}
            isDeletePending={deleteMutation.isPending}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggle={() => toggleGroup(node.group.id)}
          />
        </div>
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {node.children.map((child) => (
              <React.Fragment key={child.group.id}>
                {renderGroupNode(child, depth + 1)}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

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

      {/* Groups Hierarchical Display */}
      <div className="space-y-4">
        {groupTree.length > 0 ? (
          groupTree.map((node) => renderGroupNode(node))
        ) : (
          <GroupsEmptyState
            searchTerm={searchTerm}
            onAddGroup={() => setIsAddDialogOpen(true)}
          />
        )}
      </div>

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
        groups={Array.isArray(groups) ? groups : []}
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
        groups={Array.isArray(groups) ? groups : []}
        currentGroupId={selectedGroup?.id}
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
