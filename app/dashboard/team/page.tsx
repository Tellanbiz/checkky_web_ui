"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Mail, MoreHorizontal, Shield, Eye, UserCheck, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ViewProfileModal } from "../components/modals/view-profile-modal"
import { DeleteConfirmationModal } from "../components/modals/delete-confirmation-modal"
import { useState } from "react"
import { InviteMemberModal } from "../components/modals/invite-member-modal"
import { EditMemberRoleModal } from "../components/modals/edit-member-role-modal"

const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@company.com",
    role: "Admin",
    avatar: "JS",
    status: "Active",
    lastActive: "2 minutes ago",
    completedTasks: 45,
    totalTasks: 52,
    performance: 87,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Auditor",
    avatar: "SJ",
    status: "Active",
    lastActive: "15 minutes ago",
    completedTasks: 38,
    totalTasks: 42,
    performance: 90,
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@company.com",
    role: "Assignee",
    avatar: "MW",
    status: "Away",
    lastActive: "2 hours ago",
    completedTasks: 28,
    totalTasks: 35,
    performance: 80,
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@company.com",
    role: "Auditor",
    avatar: "ED",
    status: "Active",
    lastActive: "5 minutes ago",
    completedTasks: 33,
    totalTasks: 36,
    performance: 92,
  },
  {
    id: 5,
    name: "Lisa Brown",
    email: "lisa@company.com",
    role: "Viewer",
    avatar: "LB",
    status: "Offline",
    lastActive: "1 day ago",
    completedTasks: 12,
    totalTasks: 15,
    performance: 75,
  },
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return <Shield className="h-4 w-4" />
    case "Auditor":
      return <UserCheck className="h-4 w-4" />
    case "Viewer":
      return <Eye className="h-4 w-4" />
    default:
      return <Users className="h-4 w-4" />
  }
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-red-100 text-red-800"
    case "Auditor":
      return "bg-blue-100 text-blue-800"
    case "Assignee":
      return "bg-green-100 text-green-800"
    case "Viewer":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<any>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEditRoleModal, setShowEditRoleModal] = useState(false)
  const [memberToEditRole, setMemberToEditRole] = useState<any>(null)

  const handleViewProfile = (member: any) => {
    setSelectedMember(member)
    setShowProfileModal(true)
  }

  const handleDeleteMember = (member: any) => {
    setMemberToDelete(member)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    console.log("Deleting member:", memberToDelete)
    // Here you would actually delete the member
  }

  const handleSendMessage = (member: any) => {
    console.log("Sending message to:", member.name)
    // Here you would open a message modal or redirect
  }

  const handleEditRole = (member: any) => {
    setMemberToEditRole(member)
    setShowEditRoleModal(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">75% online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search team members..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="auditor">Auditor</SelectItem>
            <SelectItem value="assignee">Assignee</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="away">Away</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
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
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewProfile(member)}>View Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditRole(member)}>Edit Role</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSendMessage(member)}>Send Message</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member)}>
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
                    <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
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
                    <span className="text-sm text-muted-foreground">{member.status}</span>
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
                  <span className="text-muted-foreground">Last active: {member.lastActive}</span>
                </div>

                <Button className="w-full bg-transparent" variant="outline" onClick={() => handleViewProfile(member)}>
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

      <InviteMemberModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />

      {memberToEditRole && (
        <EditMemberRoleModal
          isOpen={showEditRoleModal}
          onClose={() => setShowEditRoleModal(false)}
          member={memberToEditRole}
        />
      )}
    </div>
  )
}
