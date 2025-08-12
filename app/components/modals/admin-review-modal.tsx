"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, AlertTriangle, Clock, CreditCard, Mail, Calendar, X, Check } from "lucide-react"
import { useState } from "react"

interface AdminReviewModalProps {
  isOpen: boolean
  onClose: () => void
  type: "companies" | "billing" | "tickets" | "updates"
}

export function AdminReviewModal({ isOpen, onClose, type }: AdminReviewModalProps) {
  const [selectedTab, setSelectedTab] = useState("pending")

  const pendingCompanies = [
    {
      id: 1,
      name: "Sunrise Organic Farms",
      industry: "Organic Farming",
      plan: "Professional",
      adminName: "Alice Cooper",
      adminEmail: "alice@sunriseorganic.com",
      submittedDate: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      name: "Mountain View Dairy",
      industry: "Livestock",
      plan: "Enterprise",
      adminName: "Bob Johnson",
      adminEmail: "bob@mountaindairy.com",
      submittedDate: "2024-01-14",
      status: "pending",
    },
  ]

  const billingIssues = [
    {
      id: 1,
      company: "Green Valley Farms",
      issue: "Payment Failed",
      amount: "$2,400",
      dueDate: "2024-01-10",
      attempts: 3,
      status: "overdue",
    },
    {
      id: 2,
      company: "Heritage Ranch",
      issue: "Card Expired",
      amount: "$1,200",
      dueDate: "2024-01-12",
      attempts: 1,
      status: "action_required",
    },
  ]

  const supportTickets = [
    {
      id: 1,
      title: "Cannot access checklist module",
      company: "Bloom & Blossom",
      user: "Emma Davis",
      priority: "high",
      status: "open",
      created: "2024-01-15 10:30 AM",
    },
    {
      id: 2,
      title: "File upload not working",
      company: "Organic Harvest",
      user: "Mike Wilson",
      priority: "medium",
      status: "in_progress",
      created: "2024-01-14 2:15 PM",
    },
  ]

  const handleApproveCompany = (companyId: number) => {
    console.log("Approving company:", companyId)
    // Here you would approve the company
  }

  const handleRejectCompany = (companyId: number) => {
    console.log("Rejecting company:", companyId)
    // Here you would reject the company
  }

  const handleResolveBilling = (issueId: number) => {
    console.log("Resolving billing issue:", issueId)
    // Here you would resolve the billing issue
  }

  const handleResolveTicket = (ticketId: number) => {
    console.log("Resolving ticket:", ticketId)
    // Here you would resolve the support ticket
  }

  const getTitle = () => {
    switch (type) {
      case "companies":
        return "Review Company Applications"
      case "billing":
        return "Process Billing Issues"
      case "tickets":
        return "User Support Tickets"
      case "updates":
        return "System Updates"
      default:
        return "Admin Review"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {type === "companies" && (
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="pending">Pending ({pendingCompanies.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingCompanies.map((company) => (
                  <Card key={company.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-[#16A34A] text-white">
                              {company.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{company.industry}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Plan: {company.plan}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Admin: {company.adminName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{company.adminEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Submitted: {company.submittedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleRejectCompany(company.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button onClick={() => handleApproveCompany(company.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}

          {type === "billing" && (
            <div className="space-y-4">
              {billingIssues.map((issue) => (
                <Card key={issue.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{issue.company}</span>
                          <Badge
                            variant={issue.status === "overdue" ? "destructive" : "secondary"}
                            className={issue.status === "action_required" ? "bg-yellow-100 text-yellow-800" : ""}
                          >
                            {issue.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <CreditCard className="h-3 w-3" />
                            <span>{issue.issue}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Amount: {issue.amount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Due: {issue.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Attempts: {issue.attempts}</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => handleResolveBilling(issue.id)}>Resolve</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {type === "tickets" && (
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{ticket.title}</h4>
                          <Badge
                            variant={
                              ticket.priority === "high"
                                ? "destructive"
                                : ticket.priority === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={ticket.priority === "medium" ? "bg-yellow-100 text-yellow-800" : ""}
                          >
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline">{ticket.status.replace("_", " ")}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-3 w-3" />
                            <span>{ticket.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{ticket.user}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{ticket.created}</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => handleResolveTicket(ticket.id)}>View & Resolve</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {type === "updates" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <h4 className="font-medium">Security Patch Available</h4>
                        <Badge className="bg-orange-100 text-orange-800">Critical</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Security update for user authentication system. Recommended to install immediately.
                      </p>
                      <div className="text-xs text-muted-foreground">Released: January 15, 2024 • Size: 45.2 MB</div>
                    </div>
                    <Button>Install Now</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
