"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mail, Phone, Calendar, MapPin, TrendingUp, CheckCircle, Clock } from "lucide-react"

interface ViewProfileModalProps {
  isOpen: boolean
  onClose: () => void
  member: {
    id: number
    name: string
    email: string
    role: string
    avatar: string
    status: string
    lastActive: string
    completedTasks: number
    totalTasks: number
    performance: number
  }
}

export function ViewProfileModal({ isOpen, onClose, member }: ViewProfileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Member Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">{member.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">{member.name}</h3>
              <p className="text-muted-foreground">{member.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{member.role}</Badge>
                <div className="flex items-center space-x-1">
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
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Green Valley, CA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined January 2023</span>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{member.completedTasks}</div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{member.performance}%</div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>
                    {member.completedTasks}/{member.totalTasks} tasks
                  </span>
                </div>
                <Progress value={(member.completedTasks / member.totalTasks) * 100} />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "Completed Livestock Health Check", time: "2 hours ago", type: "completion" },
                  { action: "Updated Equipment Maintenance Report", time: "1 day ago", type: "update" },
                  { action: "Assigned to Crop Quality Assessment", time: "2 days ago", type: "assignment" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`p-1 rounded-full ${
                        activity.type === "completion"
                          ? "bg-green-100"
                          : activity.type === "update"
                            ? "bg-blue-100"
                            : "bg-orange-100"
                      }`}
                    >
                      {activity.type === "completion" && <CheckCircle className="h-3 w-3 text-green-600" />}
                      {activity.type === "update" && <TrendingUp className="h-3 w-3 text-blue-600" />}
                      {activity.type === "assignment" && <Clock className="h-3 w-3 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Edit Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
