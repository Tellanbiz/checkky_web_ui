"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, UserCheck, Eye, Users, Save, X } from "lucide-react"
import { useState } from "react"

interface EditMemberRoleModalProps {
  isOpen: boolean
  onClose: () => void
  member: {
    id: number
    name: string
    email: string
    role: string
    avatar: string
  }
}

export function EditMemberRoleModal({ isOpen, onClose, member }: EditMemberRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState(member.role)

  const roles = [
    {
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
  ]

  const handleSave = () => {
    console.log("Updating role for", member.name, "to", selectedRole)
    onClose()
    // Here you would update the member's role
  }

  const selectedRoleData = roles.find((role) => role.name === selectedRole)

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
              <AvatarFallback>{member.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-muted-foreground">Current role:</span>
                <Badge variant="outline">{member.role}</Badge>
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
                    <SelectItem key={role.name} value={role.name}>
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
                    <Badge className={selectedRoleData.color}>{selectedRoleData.name}</Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Permissions:</h4>
                    <ul className="space-y-1">
                      {selectedRoleData.permissions.map((permission, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
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
                  key={role.name}
                  className={`cursor-pointer transition-all ${
                    selectedRole === role.name ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedRole(role.name)}
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
                <strong>Note:</strong> Changing this member's role will immediately update their access permissions.
                They will receive an email notification about this change.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={selectedRole === member.role}>
              <Save className="mr-2 h-4 w-4" />
              Update Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
