"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X, Users, Hash, Lock } from "lucide-react"
import { useState } from "react"

interface AddChatRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddChatRoomModal({ isOpen, onClose }: AddChatRoomModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "public",
    category: "",
  })
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const teamMembers = [
    { id: "1", name: "John Smith", role: "Admin", avatar: "JS" },
    { id: "2", name: "Sarah Johnson", role: "Auditor", avatar: "SJ" },
    { id: "3", name: "Mike Wilson", role: "Assignee", avatar: "MW" },
    { id: "4", name: "Emma Davis", role: "Assignee", avatar: "ED" },
    { id: "5", name: "Lisa Brown", role: "Viewer", avatar: "LB" },
    { id: "6", name: "David Chen", role: "Assignee", avatar: "DC" },
    { id: "7", name: "Anna Rodriguez", role: "Auditor", avatar: "AR" },
    { id: "8", name: "Tom Wilson", role: "Viewer", avatar: "TW" },
  ]

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const handleCreate = () => {
    console.log("Creating chat room:", { formData, selectedMembers })
    onClose()
    // Reset form
    setFormData({
      name: "",
      description: "",
      type: "public",
      category: "",
    })
    setSelectedMembers([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Chat Room</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="room-name">Room Name *</Label>
            <Input
              id="room-name"
              placeholder="Enter room name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-description">Description</Label>
            <Textarea
              id="room-description"
              placeholder="Enter room description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Room Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4" />
                      <span>Public - Everyone can join</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Private - Invite only</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="livestock">Livestock</SelectItem>
                  <SelectItem value="crop">Crop Farming</SelectItem>
                  <SelectItem value="flower">Flower Farming</SelectItem>
                  <SelectItem value="announcements">Announcements</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Member Selection */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Add Members</span>
            </Label>
            <Card>
              <CardContent className="p-4">
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => handleMemberToggle(member.id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-3 text-sm text-muted-foreground">{selectedMembers.length} member(s) selected</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
