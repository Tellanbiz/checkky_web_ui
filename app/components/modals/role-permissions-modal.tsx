"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Users,
  Building2,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  CheckCircle2,
  Eye,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  CreditCard,
  Download,
  Activity,
} from "lucide-react"
import { useState } from "react"

interface RolePermissionsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Permission {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

interface PermissionCategory {
  id: string
  name: string
  icon: React.ReactNode
  permissions: Permission[]
}

interface Role {
  id: string
  name: string
  description: string
  color: string
  permissions: string[]
}

export function RolePermissionsModal({ isOpen, onClose }: RolePermissionsModalProps) {
  const [selectedRole, setSelectedRole] = useState("admin")

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "Admin",
      description: "Full system access",
      color: "bg-red-100 text-red-800",
      permissions: [
        "checklists_view",
        "checklists_create",
        "checklists_edit",
        "checklists_delete",
        "checklists_assign",
        "teams_view",
        "teams_invite",
        "teams_edit",
        "teams_remove",
        "teams_roles",
        "companies_view",
        "companies_create",
        "companies_edit",
        "companies_delete",
        "companies_billing",
        "guidelines_view",
        "guidelines_create",
        "guidelines_edit",
        "guidelines_delete",
        "chat_view",
        "chat_create",
        "chat_moderate",
        "analytics_view",
        "analytics_export",
        "admin_users",
        "admin_settings",
        "admin_logs",
      ],
    },
    {
      id: "auditor",
      name: "Auditor",
      description: "Review and audit access",
      color: "bg-blue-100 text-blue-800",
      permissions: [
        "checklists_view",
        "checklists_edit",
        "checklists_assign",
        "teams_view",
        "companies_view",
        "guidelines_view",
        "chat_view",
        "analytics_view",
        "analytics_export",
      ],
    },
    {
      id: "assignee",
      name: "Assignee",
      description: "Complete assigned tasks",
      color: "bg-green-100 text-green-800",
      permissions: [
        "checklists_view",
        "checklists_edit",
        "teams_view",
        "companies_view",
        "guidelines_view",
        "chat_view",
        "chat_create",
      ],
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Read-only access",
      color: "bg-gray-100 text-gray-800",
      permissions: ["checklists_view", "teams_view", "companies_view", "guidelines_view", "chat_view"],
    },
  ])

  const permissionCategories: PermissionCategory[] = [
    {
      id: "checklists",
      name: "Checklists",
      icon: <FileText className="h-4 w-4" />,
      permissions: [
        {
          id: "checklists_view",
          name: "View Checklists",
          description: "View all checklists and their status",
          icon: <Eye className="h-3 w-3" />,
        },
        {
          id: "checklists_create",
          name: "Create Checklists",
          description: "Create new checklists and tasks",
          icon: <Plus className="h-3 w-3" />,
        },
        {
          id: "checklists_edit",
          name: "Edit Checklists",
          description: "Modify existing checklists",
          icon: <Edit className="h-3 w-3" />,
        },
        {
          id: "checklists_delete",
          name: "Delete Checklists",
          description: "Remove checklists from system",
          icon: <Trash2 className="h-3 w-3" />,
        },
        {
          id: "checklists_assign",
          name: "Assign Tasks",
          description: "Assign checklist tasks to team members",
          icon: <UserPlus className="h-3 w-3" />,
        },
      ],
    },
    {
      id: "teams",
      name: "Teams",
      icon: <Users className="h-4 w-4" />,
      permissions: [
        {
          id: "teams_view",
          name: "View Team",
          description: "View team members and their roles",
          icon: <Eye className="h-3 w-3" />,
        },
        {
          id: "teams_invite",
          name: "Invite Members",
          description: "Send invitations to new team members",
          icon: <UserPlus className="h-3 w-3" />,
        },
        {
          id: "teams_edit",
          name: "Edit Members",
          description: "Modify team member information",
          icon: <Edit className="h-3 w-3" />,
        },
        {
          id: "teams_remove",
          name: "Remove Members",
          description: "Remove team members from organization",
          icon: <Trash2 className="h-3 w-3" />,
        },
        {
          id: "teams_roles",
          name: "Manage Roles",
          description: "Change team member roles and permissions",
          icon: <Shield className="h-3 w-3" />,
        },
      ],
    },
    {
      id: "companies",
      name: "Companies",
      icon: <Building2 className="h-4 w-4" />,
      permissions: [
        {
          id: "companies_view",
          name: "View Companies",
          description: "View company profiles and information",
          icon: <Eye className="h-3 w-3" />,
        },
        {
          id: "companies_create",
          name: "Create Companies",
          description: "Add new companies to the system",
          icon: <Plus className="h-3 w-3" />,
        },
        {
          id: "companies_edit",
          name: "Edit Companies",
          description: "Modify company details and settings",
          icon: <Edit className="h-3 w-3" />,
        },
        {
          id: "companies_delete",
          name: "Delete Companies",
          description: "Remove companies from system",
          icon: <Trash2 className="h-3 w-3" />,
        },
        {
          id: "companies_billing",
          name: "Manage Billing",
          description: "Access billing and subscription management",
          icon: <CreditCard className="h-3 w-3" />,
        },
      ],
    },
    {
      id: "guidelines",
      name: "Guidelines",
      icon: <FileText className="h-4 w-4" />,
      permissions: [
        {
          id: "guidelines_view",
          name: "View Guidelines",
          description: "Access and read all guidelines",
          icon: <Eye className="h-3 w-3" />,
        },
        {
          id: "guidelines_create",
          name: "Create Guidelines",
          description: "Create new guidelines and documentation",
          icon: <Plus className="h-3 w-3" />,
        },
        {
          id: "guidelines_edit",
          name: "Edit Guidelines",
          description: "Modify existing guidelines",
          icon: <Edit className="h-3 w-3" />,
        },
        {
          id: "guidelines_delete",
          name: "Delete Guidelines",
          description: "Remove guidelines from system",
          icon: <Trash2 className="h-3 w-3" />,
        },
      ],
    },
    {
      id: "chat",
      name: "Chat",
      icon: <MessageSquare className="h-4 w-4" />,
      permissions: [
        {
          id: "chat_view",
          name: "View Chat",
          description: "Access team chat and messages",
          icon: <Eye className="h-3 w-3" />,
        },
        {
          id: "chat_create",
          name: "Create Rooms",
          description: "Create new chat rooms and channels",
          icon: <Plus className="h-3 w-3" />,
        },
        {
          id: "chat_moderate",
          name: "Moderate Chat",
          description: "Moderate chat rooms and manage messages",
          icon: <Shield className="h-3 w-3" />,
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      permissions: [
        {
          id: "analytics_view",
          name: "View Analytics",
          description: "Access reports and analytics dashboard",
          icon: <Eye className="h-3 w-3" />,
        },
        {
          id: "analytics_export",
          name: "Export Data",
          description: "Export analytics data and reports",
          icon: <Download className="h-3 w-3" />,
        },
      ],
    },
    {
      id: "admin",
      name: "Admin",
      icon: <Settings className="h-4 w-4" />,
      permissions: [
        {
          id: "admin_users",
          name: "Manage Users",
          description: "Full user management capabilities",
          icon: <Users className="h-3 w-3" />,
        },
        {
          id: "admin_settings",
          name: "System Settings",
          description: "Configure system-wide settings",
          icon: <Settings className="h-3 w-3" />,
        },
        {
          id: "admin_logs",
          name: "View Logs",
          description: "Access system logs and audit trails",
          icon: <Activity className="h-3 w-3" />,
        },
      ],
    },
  ]

  const currentRole = roles.find((role) => role.id === selectedRole)

  const togglePermission = (permissionId: string) => {
    if (selectedRole === "admin") return // Admin permissions cannot be changed

    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id === selectedRole) {
          const hasPermission = role.permissions.includes(permissionId)
          return {
            ...role,
            permissions: hasPermission
              ? role.permissions.filter((p) => p !== permissionId)
              : [...role.permissions, permissionId],
          }
        }
        return role
      }),
    )
  }

  const resetToDefaults = () => {
    // Reset to default permissions (implementation would restore original state)
    console.log("Resetting to default permissions...")
  }

  const saveChanges = () => {
    console.log("Saving permission changes:", roles)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Role Permissions Management</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Select Role</h3>
            <div className="space-y-2">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all ${
                    selectedRole === role.id ? "ring-2 ring-[#16A34A] border-[#16A34A]" : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{role.name}</h4>
                      <Badge className={role.color}>{role.permissions.length}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Permissions for {currentRole?.name}</h3>
                <p className="text-sm text-muted-foreground">{currentRole?.permissions.length} permissions active</p>
              </div>
              {selectedRole === "admin" && (
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Protected Role
                </Badge>
              )}
            </div>

            <div className="space-y-6">
              {permissionCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      {category.icon}
                      <span>{category.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {category.permissions.filter((p) => currentRole?.permissions.includes(p.id)).length} /{" "}
                        {category.permissions.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-1 rounded bg-gray-100">{permission.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{permission.name}</span>
                              {currentRole?.permissions.includes(permission.id) && (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={currentRole?.permissions.includes(permission.id) || false}
                          onCheckedChange={() => togglePermission(permission.id)}
                          disabled={selectedRole === "admin"}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={saveChanges}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
