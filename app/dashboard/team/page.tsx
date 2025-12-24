"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { InviteMemberModal } from "@/components/team/invite-member-modal";
import { ViewProfileModal } from "@/components/team/view-profile-modal";
import { DeleteConfirmationModal } from "@/components/team/delete-confirmation-modal";
import { EditMemberRoleModal } from "@/components/team/edit-member-role-modal";
import { TeamMember } from "@/lib/services/teams/data";
import { useToast } from "@/hooks/use-toast";
import {
  TeamMembersHeader,
  TeamMembersGrid,
  useTeamMembers,
  useUpdateTeamMemberRole,
  useRemoveTeamMember,
} from "@/components/team/members";

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [memberToEditRole, setMemberToEditRole] = useState<TeamMember | null>(
    null
  );
  const { toast } = useToast();

  // TanStack Query hooks
  const { data: teamMembers = [], isLoading, error, refetch } = useTeamMembers();
  const updateRoleMutation = useUpdateTeamMemberRole();
  const removeMemberMutation = useRemoveTeamMember();

  const handleViewProfile = (member: TeamMember) => {
    setSelectedMember(member);
    setShowProfileModal(true);
  };

  const handleDeleteMember = (member: TeamMember) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      removeMemberMutation.mutate(memberToDelete.id);
    }
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  const handleSendMessage = (member: TeamMember) => {
    console.log("Sending message to:", member.user.full_name);
    // Here you would open a message modal or redirect
  };

  const handleEditRole = (member: TeamMember) => {
    setMemberToEditRole(member);
    setShowEditRoleModal(true);
  };

  const handleRoleUpdated = (newRole: string) => {
    if (memberToEditRole) {
      updateRoleMutation.mutate({
        memberId: memberToEditRole.id,
        newRole: newRole as "admin" | "auditor" | "assignee" | "viewer",
      });
    }
    setShowEditRoleModal(false);
    setMemberToEditRole(null);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleInviteMember = () => {
    setShowInviteModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 p-4 sm:p-6 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <TeamMembersHeader
        onInviteMember={handleInviteMember}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Team Members Grid */}
      <TeamMembersGrid
        teamMembers={teamMembers}
        onViewProfile={handleViewProfile}
        onEditRole={handleEditRole}
        onSendMessage={handleSendMessage}
        onDeleteMember={handleDeleteMember}
      />

      {/* Modals */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
      {selectedMember && (
        <ViewProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          member={selectedMember}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Remove Team Member"
        description="Are you sure you want to remove this team member? They will lose access to all checklists and data."
        itemName={memberToDelete?.user.full_name || ""}
      />

      {memberToEditRole && (
        <EditMemberRoleModal
          isOpen={showEditRoleModal}
          onClose={() => setShowEditRoleModal(false)}
          member={memberToEditRole}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
    </div>
  );
}
