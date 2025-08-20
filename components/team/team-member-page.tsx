"use client";

import { useState } from "react";
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

// Mock data - replace with actual API calls
const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Admin",
    avatar: "SJ",
    status: "Active",
    performance: 95,
    completedTasks: 47,
    totalTasks: 50,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "Auditor",
    avatar: "MC",
    status: "Active",
    performance: 88,
    completedTasks: 35,
    totalTasks: 40,
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    role: "Assignee",
    avatar: "ER",
    status: "Away",
    performance: 92,
    completedTasks: 28,
    totalTasks: 30,
    lastActive: "4 hours ago",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@company.com",
    role: "Viewer",
    avatar: "DK",
    status: "Active",
    performance: 78,
    completedTasks: 15,
    totalTasks: 20,
    lastActive: "30 minutes ago",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    role: "Auditor",
    avatar: "LT",
    status: "Active",
    performance: 91,
    completedTasks: 42,
    totalTasks: 45,
    lastActive: "3 hours ago",
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.wilson@company.com",
    role: "Assignee",
    avatar: "JW",
    status: "Active",
    performance: 85,
    completedTasks: 33,
    totalTasks: 38,
    lastActive: "1 hour ago",
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return <Shield className="h-4 w-4 text-red-600" />;
    case "Auditor":
      return <UserCheck className="h-4 w-4 text-blue-600" />;
    case "Assignee":
      return <Users className="h-4 w-4 text-green-600" />;
    case "Viewer":
      return <Eye className="h-4 w-4 text-gray-600" />;
    default:
      return <Users className="h-4 w-4 text-gray-600" />;
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

export function Page() {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [memberToEditRole, setMemberToEditRole] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleViewProfile = (member: any) => {
    setSelectedMember(member);
    setShowProfileModal(true);
  };

  const handleDeleteMember = (member: any) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleting member:", memberToDelete);
    // Here you would actually delete the member
  };

  const handleSendMessage = (member: any) => {
    console.log("Sending message to:", member.name);
    // Here you would open a message modal or redirect
  };

  const handleEditRole = (member: any) => {
    setMemberToEditRole(member);
    setShowEditRoleModal(true);
  };

  const handleRoleUpdated = () => {
    // Refresh team data after role update
    // In a real app, you would refetch the team members here
    console.log("Role updated, refreshing team data...");
    // You could add a refetch function here if you have an API
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real app, you would refetch team data here
      console.log("Team data refreshed");
    } catch (error) {
      console.error("Error refreshing team data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

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
                    <AvatarFallback>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
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
                {/* Role and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(member.role)}
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        member.status === "Active"
                          ? "bg-green-500"
                          : member.status === "Away"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {member.status}
                    </span>
                  </div>
                </div>

                {/* Performance */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span className="font-medium">{member.performance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        member.performance >= 90
                          ? "bg-green-500"
                          : member.performance >= 80
                          ? "bg-blue-500"
                          : member.performance >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${member.performance}%` }}
                    />
                  </div>
                </div>

                {/* Task Stats */}
                <div className="flex justify-between text-sm">
                  <span>
                    Tasks: {member.completedTasks}/{member.totalTasks}
                  </span>
                  <span className="text-muted-foreground">
                    Last active: {member.lastActive}
                  </span>
                </div>

                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => handleViewProfile(member)}
                >
                  View Details
                </Button>
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
        itemName={memberToDelete?.name || ""}
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
