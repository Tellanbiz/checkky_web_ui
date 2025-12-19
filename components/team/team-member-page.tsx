"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  Eye,
  UserCheck,
  Users,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewProfileModal } from "./view-profile-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { EditMemberRoleModal } from "./edit-member-role-modal";
import { getTeamMembersAction } from "@/lib/services/teams/actions";
import { TeamMember } from "@/lib/services/teams/data";

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Shield className="h-4 w-4 text-red-600" />;
    case "auditor":
      return <UserCheck className="h-4 w-4 text-blue-600" />;
    case "assignee":
      return <Users className="h-4 w-4 text-green-600" />;
    case "viewer":
      return <Eye className="h-4 w-4 text-gray-600" />;
    default:
      return <Users className="h-4 w-4 text-gray-600" />;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "auditor":
      return "bg-blue-100 text-blue-800";
    case "assignee":
      return "bg-green-100 text-green-800";
    case "viewer":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "admin":
      return "Admin";
    case "auditor":
      return "Auditor";
    case "assignee":
      return "Assignee";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
};

export function Page() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [memberToEditRole, setMemberToEditRole] = useState<TeamMember | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTeamMembersAction();
      if (result.success && result.data) {
        setTeamMembers(result.data);
      } else {
        setError(result.error || "Failed to fetch team members");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleViewProfile = (member: TeamMember) => {
    setSelectedMember(member);
    setShowProfileModal(true);
  };

  const handleDeleteMember = (member: TeamMember) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleting member:", memberToDelete);
    // Here you would actually delete the member
  };

  const handleSendMessage = (member: TeamMember) => {
    console.log("Sending message to:", member.user.full_name);
    // Here you would open a message modal or redirect
  };

  const handleEditRole = (member: TeamMember) => {
    setMemberToEditRole(member);
    setShowEditRoleModal(true);
  };

  const handleRoleUpdated = () => {
    // Refresh team data after role update
    fetchTeamMembers();
  };

  const handleRefresh = async () => {
    await fetchTeamMembers();
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} disabled={loading}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search team members..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="auditor">Auditor</SelectItem>
            <SelectItem value="assignee">Assignee</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {member.user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditRole(member)}>
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSendMessage(member)}>
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteMember(member)}
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Role */}
                <div className="flex items-center space-x-2">
                  {getRoleIcon(member.role)}
                  <Badge className={getRoleBadgeColor(member.role)}>
                    {getRoleDisplayName(member.role)}
                  </Badge>
                </div>

                {/* Task Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tasks Completed</span>
                    <span className="font-medium">
                      {member.checklist_stats.completed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        member.checklist_stats.total > 0
                          ? member.checklist_stats.completed /
                              member.checklist_stats.total >=
                            0.9
                            ? "bg-green-500"
                            : member.checklist_stats.completed /
                                member.checklist_stats.total >=
                              0.8
                            ? "bg-blue-500"
                            : member.checklist_stats.completed /
                                member.checklist_stats.total >=
                              0.7
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          : "bg-gray-400"
                      }`}
                      style={{
                        width:
                          member.checklist_stats.total > 0
                            ? `${
                                (member.checklist_stats.completed /
                                  member.checklist_stats.total) *
                                100
                              }%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* Task Stats */}
                <div className="flex justify-between text-sm">
                  <span>
                    Tasks: {member.checklist_stats.completed}/
                    {member.checklist_stats.total}
                  </span>
                  <span className="text-muted-foreground">
                    Pending: {member.checklist_stats.pending}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
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
