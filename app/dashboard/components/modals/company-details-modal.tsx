"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Users,
  CheckSquare,
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Crown,
  Star,
} from "lucide-react"

interface CompanyDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  company: {
    id: number
    name: string
    industry: string
    plan: string
    members: number
    checklists: number
    completion: number
    joinDate: string
    status: string
    logo: string
    revenue: string
  }
}

export function CompanyDetailsModal({ isOpen, onClose, company }: CompanyDetailsModalProps) {
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1" />
            {plan}
          </Badge>
        )
      case "Professional":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Star className="w-3 h-3 mr-1" />
            {plan}
          </Badge>
        )
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Company Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-[#16A34A] text-white font-semibold text-lg">{company.logo}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">{company.name}</h3>
              <p className="text-muted-foreground">{company.industry}</p>
              <div className="flex items-center space-x-2 mt-2">
                {getPlanBadge(company.plan)}
                <Badge
                  variant={company.status === "Active" ? "default" : "outline"}
                  className={company.status === "Active" ? "bg-green-100 text-green-800" : ""}
                >
                  {company.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{company.members}</div>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckSquare className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold">{company.checklists}</div>
                <p className="text-sm text-muted-foreground">Checklists</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{company.completion}%</div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <Progress value={company.completion} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold">{company.revenue}</div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Company Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>contact@{company.name.toLowerCase().replace(/\s+/g, "")}.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 987-6543</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>www.{company.name.toLowerCase().replace(/\s+/g, "")}.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Green Valley, CA 95945</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(company.joinDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-medium">{company.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Billing</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Next Payment</span>
                  <span className="font-medium">Feb 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="font-medium">•••• 4242</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "New team member added: Lisa Brown", time: "2 days ago" },
                  { action: "Completed 15 checklists this week", time: "3 days ago" },
                  { action: "Upgraded to Enterprise plan", time: "1 week ago" },
                  { action: "Payment processed successfully", time: "2 weeks ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="text-sm">{activity.action}</span>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Contact Company
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Building2 className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
