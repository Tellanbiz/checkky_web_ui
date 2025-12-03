"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Send,
  XCircle,
  CheckCircle,
  Mail,
} from "lucide-react";
import { TeamInvite } from "@/lib/services/teams/data";

interface InvitesTableProps {
  invites: TeamInvite[];
  onResendInvite: (invite: TeamInvite) => void;
  onDeleteInvite: (invite: TeamInvite) => void;
}

export function InvitesTable({ invites, onResendInvite, onDeleteInvite }: InvitesTableProps) {
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
          {invites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center space-y-3">
                  <Mail className="h-12 w-12 text-gray-400" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      No Invites Available
                    </h3>
                    <p className="text-sm text-gray-500">
                      There are currently no team invitations. Click "Invite Member" to send your first invitation.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            invites.map((invite) => (
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
                        onClick={() => onResendInvite(invite)}
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
                      onClick={() => onDeleteInvite(invite)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
