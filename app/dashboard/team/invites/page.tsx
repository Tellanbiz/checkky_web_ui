"use client";

import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { TeamInvite } from "@/lib/services/teams/data";
import { DeleteConfirmationModal } from "@/components/team/delete-confirmation-modal";
import { InviteMemberModal } from "@/components/team/invite-member-modal";
import {
  useTeamInvites,
  useInviteTeamMember,
  useResendTeamInvite,
  InvitesHeader,
  InvitesTable,
} from "@/components/team/invites";

export default function Page() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TeamInvite | null>(null);
  const { toast } = useToast();

  // TanStack Query hooks
  const { data: invites = [], isLoading, error, refetch } = useTeamInvites();
  const inviteMutation = useInviteTeamMember();
  const resendMutation = useResendTeamInvite();

  const handleDeleteInvite = (invite: TeamInvite) => {
    setItemToDelete(invite);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleResendInvite = (invite: TeamInvite) => {
    resendMutation.mutate(invite);
  };

  const handleInviteMember = () => {
    setShowInviteModal(true);
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch team invites. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <InvitesHeader onInviteMember={handleInviteMember} />

      {/* Team Invites Table */}
      <div className="space-y-4">
        <InvitesTable
          invites={invites}
          onResendInvite={handleResendInvite}
          onDeleteInvite={handleDeleteInvite}
        />
      </div>

      {/* Modals */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={"Cancel Team Invite"}
        description={
          "Are you sure you want to cancel this invitation? The recipient will no longer be able to join the team."
        }
        itemName={itemToDelete?.email || ""}
      />
    </div>
  );
}
