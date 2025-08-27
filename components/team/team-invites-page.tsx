"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  RefreshCw,
  Loader2,
  Mail,
  Send,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { InviteMemberModal } from "./invite-member-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import {
  getAllTeamInvites,
  inviteTeamMemberAction,
} from "@/lib/services/teams/actions";
import { useToast } from "@/hooks/use-toast";
import { TeamInvite } from "@/lib/services/teams/data";
import { getTeamInvites } from "@/lib/services/teams/get";

export function Page() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      // In a real app, you would get the token from auth context
      const teamInvites = await getAllTeamInvites();
      setInvites(teamInvites);
    } catch (error) {
      console.error("Error fetching team invites:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team invites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvite = (invite: any) => {
    setItemToDelete(invite);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleting invite:", itemToDelete);
    // Here you would actually delete the invite
    setShowDeleteModal(false);
  };

  const handleResendInvite = async (invite: TeamInvite) => {
    try {
      const result = await inviteTeamMemberAction({
        invites: [
          {
            email: invite.email,
            role: invite.role as "admin" | "auditor" | "assignee" | "viewer",
          },
        ],
      });

      if (result.success) {
        toast({
          title: "Invitation Resent",
          description: `Successfully resent invitation to ${invite.email}`,
        });
        fetchInvites(); // Refresh the invites data
      } else {
        toast({
          title: "Resend Failed",
          description:
            result.error || "Failed to resend invitation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while resending the invitation.",
        variant: "destructive",
      });
    }
  };

  const handleInviteSent = async (inviteData: {
    email: string;
    role: "admin" | "auditor" | "assignee" | "viewer";
  }) => {
    try {
      const result = await inviteTeamMemberAction({
        invites: [inviteData],
      });

      if (result.success) {
        toast({
          title: "Invitation Sent",
          description: `Successfully sent invitation to ${inviteData.email}`,
        });
        fetchInvites(); // Refresh the invites data
      } else {
        toast({
          title: "Invitation Failed",
          description:
            result.error || "Failed to send invitation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while sending the invitation.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await fetchInvites();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "Expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Auditor":
        return "bg-blue-100 text-blue-800";
      case "Assignee":
        return "bg-green-100 text-green-800";
      case "Viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search invites..." className="pl-10" />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button onClick={() => setShowInviteModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Team Invites Table */}
      <div className="space-y-4">
        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <div className="font-medium">{invite.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleBadgeColor(invite.role)}>
                        {invite.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(invite.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(invite.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {(invite.status === "pending" ||
                        invite.status === "declined") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvite(invite)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Resend
                        </Button>
                      )}
                      {invite.status === "accepted" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="border-green-200 text-green-600 bg-green-50"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accepted
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInvite(invite)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
