"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, UserCheck, Eye, Users, Save, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/lib/services/teams/data";
import { updateTeamMemberRoleAction } from "@/lib/services/teams/actions";

interface EditMemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
  onRoleUpdated?: (newRole: string) => void;
}

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

export function EditMemberRoleModal({
  isOpen,
  onClose,
  member,
  onRoleUpdated,
}: EditMemberRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState(member.role);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const roles = [
    {
      value: "admin",
      name: "Admin",
      icon: Shield,
      color: "bg-red-100 text-red-800",
      permissions: [
        "Full access to all features",
        "Manage team members and roles",
        "Access admin dashboard",
        "Configure system settings",
        "View all reports and analytics",
      ],
    },
    {
      value: "auditor",
      name: "Auditor",
      icon: UserCheck,
      color: "bg-blue-100 text-blue-800",
      permissions: [
        "Create and edit checklists",
        "Complete assigned tasks",
        "Upload evidence and files",
        "View team performance",
        "Access guidelines and resources",
      ],
    },
    {
      value: "assignee",
      name: "Assignee",
      icon: Users,
      color: "bg-green-100 text-green-800",
      permissions: [
        "Complete assigned checklists",
        "Upload evidence for tasks",
        "View assigned tasks only",
        "Basic reporting access",
        "Team chat access",
      ],
    },
    {
      value: "viewer",
      name: "Viewer",
      icon: Eye,
      color: "bg-gray-100 text-gray-800",
      permissions: [
        "Read-only access to checklists",
        "View reports and analytics",
        "Access guidelines",
        "Team chat access",
        "No editing permissions",
      ],
    },
  ];

  const handleSave = async () => {
    if (selectedRole === member.role) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      const result = await updateTeamMemberRoleAction(member.id, selectedRole);

      if (!result.success) {
        throw new Error(result.error || "Failed to update member role");
      }

      toast({
        title: "Role Updated",
        description: `${
          member.user.full_name
        }'s role has been updated to ${getRoleDisplayName(selectedRole)}.`,
      });

      onRoleUpdated?.(selectedRole);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleData = roles.find((role) => role.value === selectedRole);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
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
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  Current role:
                </span>
                <Badge variant="outline">
                  {getRoleDisplayName(member.role)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select New Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center space-x-2">
                        <role.icon className="h-4 w-4" />
                        <span>{role.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role Details */}
            {selectedRoleData && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <selectedRoleData.icon className="h-5 w-5" />
                    <Badge className={selectedRoleData.color}>
                      {selectedRoleData.name}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Permissions:</h4>
                    <ul className="space-y-1">
                      {selectedRoleData.permissions.map((permission, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center space-x-2"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Role Comparison */}
          <div className="space-y-3">
            <Label>All Available Roles</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map((role) => (
                <Card
                  key={role.value}
                  className={`cursor-pointer transition-all ${
                    selectedRole === role.value ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <role.icon className="h-4 w-4" />
                      <Badge className={role.color}>{role.name}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {role.permissions.slice(0, 2).join(", ")}
                      {role.permissions.length > 2 && "..."}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Warning */}
          {selectedRole !== member.role && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Changing this member's role will
                immediately update their access permissions. They will receive
                an email notification about this change.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedRole === member.role || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Role
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
