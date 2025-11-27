"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
} from "lucide-react"
import { useState } from "react"

interface BillingResolveModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BillingResolveModal({ isOpen, onClose }: BillingResolveModalProps) {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [resolutionAction, setResolutionAction] = useState("")
  const [notes, setNotes] = useState("")

  const billingIssues = [
    {
      id: 1,
      company: "Green Valley Farms",
      issue: "Payment Failed",
      amount: "$2,400",
      dueDate: "2024-01-10",
      attempts: 3,
      status: "overdue",
      plan: "Professional",
      contact: "sarah@greenvalley.com",
      phone: "+1 (555) 123-4567",
      lastPayment: "2023-12-10",
      paymentMethod: "**** 4532",
      invoiceId: "INV-2024-001",
    },
    {
      id: 2,
      company: "Heritage Ranch",
      issue: "Card Expired",
      amount: "$1,200",
      dueDate: "2024-01-12",
      attempts: 1,
      status: "action_required",
      plan: "Basic",
      contact: "mike@heritageranch.com",
      phone: "+1 (555) 987-6543",
      lastPayment: "2023-11-12",
      paymentMethod: "**** 8901",
      invoiceId: "INV-2024-002",
    },
    {
      id: 3,
      company: "Sunrise Organic",
      issue: "Subscription Downgrade",
      amount: "$800",
      dueDate: "2024-01-15",
      attempts: 0,
      status: "pending",
      plan: "Enterprise",
      contact: "admin@sunriseorganic.com",
      phone: "+1 (555) 456-7890",
      lastPayment: "2023-12-15",
      paymentMethod: "**** 2345",
      invoiceId: "INV-2024-003",
    },
  ]

  const paymentHistory = [
    { date: "2023-12-10", amount: "$2,400", status: "success", method: "**** 4532" },
    { date: "2023-11-10", amount: "$2,400", status: "success", method: "**** 4532" },
    { date: "2023-10-10", amount: "$2,400", status: "success", method: "**** 4532" },
    { date: "2023-09-10", amount: "$2,400", status: "failed", method: "**** 4532" },
  ]

  const handleResolveIssue = (action: string) => {
    console.log("Resolving with action:", action, "Notes:", notes)
    onClose()
  }

  const handleSendReminder = () => {
    console.log("Sending payment reminder")
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log("Downloading invoice:", invoiceId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing Issues Resolution Center</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Issue Details</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="actions">Resolution Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">$4,400</div>
                  <p className="text-xs text-muted-foreground">Across 3 companies</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Issues</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <p className="text-xs text-muted-foreground">Require immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Billing Issues</h3>
              {billingIssues.map((issue) => (
                <Card key={issue.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{issue.company}</span>
                          <Badge
                            variant={
                              issue.status === "overdue"
                                ? "destructive"
                                : issue.status === "action_required"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              issue.status === "action_required"
                                ? "bg-yellow-100 text-yellow-800"
                                : issue.status === "pending"
                                  ? "bg-blue-100 text-blue-800"
                                  : ""
                            }
                          >
                            {issue.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{issue.issue}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{issue.amount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {issue.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{issue.attempts} attempts</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={handleSendReminder}>
                          <Mail className="mr-1 h-3 w-3" />
                          Remind
                        </Button>
                        <Button size="sm" onClick={() => setSelectedTab("details")}>
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Issue Details - Green Valley Farms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Company:</span>
                      <span className="text-sm">Green Valley Farms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Issue:</span>
                      <span className="text-sm">Payment Failed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-sm">$2,400</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Due Date:</span>
                      <span className="text-sm">January 10, 2024</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Contact:</span>
                      <span className="text-sm">sarah@greenvalley.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="text-sm">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Payment Method:</span>
                      <span className="text-sm">**** 4532</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Invoice:</span>
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={() => handleDownloadInvoice("INV-2024-001")}
                      >
                        INV-2024-001 <Download className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History - Green Valley Farms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${payment.status === "success" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          {payment.status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={payment.status === "success" ? "default" : "destructive"}>
                          {payment.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{payment.method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resolution Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="action">Select Resolution Action</Label>
                  <Select value={resolutionAction} onValueChange={setResolutionAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an action..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retry_payment">Retry Payment</SelectItem>
                      <SelectItem value="update_payment_method">Update Payment Method</SelectItem>
                      <SelectItem value="extend_due_date">Extend Due Date</SelectItem>
                      <SelectItem value="apply_discount">Apply Discount</SelectItem>
                      <SelectItem value="suspend_account">Suspend Account</SelectItem>
                      <SelectItem value="manual_payment">Record Manual Payment</SelectItem>
                      <SelectItem value="contact_customer">Contact Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {resolutionAction === "extend_due_date" && (
                  <div className="space-y-2">
                    <Label htmlFor="new_due_date">New Due Date</Label>
                    <Input type="date" id="new_due_date" />
                  </div>
                )}

                {resolutionAction === "apply_discount" && (
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount Amount (%)</Label>
                    <Input type="number" id="discount" placeholder="10" />
                  </div>
                )}

                {resolutionAction === "manual_payment" && (
                  <div className="space-y-2">
                    <Label htmlFor="payment_amount">Payment Amount</Label>
                    <Input type="number" id="payment_amount" placeholder="2400" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Resolution Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about the resolution..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleResolveIssue(resolutionAction)} disabled={!resolutionAction}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Apply Resolution
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
