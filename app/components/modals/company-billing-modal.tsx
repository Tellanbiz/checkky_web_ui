"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Download, Edit, AlertCircle, CheckCircle, Crown, Star, X, Save } from "lucide-react"
import { useState } from "react"

interface CompanyBillingModalProps {
  isOpen: boolean
  onClose: () => void
  company: {
    id: number
    name: string
    plan: string
    revenue: string
  }
}

export function CompanyBillingModal({ isOpen, onClose, company }: CompanyBillingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(company.plan)
  const [billingCycle, setBillingCycle] = useState("monthly")

  const plans = [
    {
      name: "Starter",
      price: { monthly: 29, yearly: 290 },
      features: ["Up to 5 team members", "Basic checklists", "Email support", "Mobile app access"],
      icon: null,
    },
    {
      name: "Professional",
      price: { monthly: 99, yearly: 990 },
      features: [
        "Up to 25 team members",
        "Advanced checklists",
        "Priority support",
        "Analytics dashboard",
        "Custom guidelines",
      ],
      icon: <Star className="w-4 h-4" />,
    },
    {
      name: "Enterprise",
      price: { monthly: 199, yearly: 1990 },
      features: [
        "Unlimited team members",
        "All features included",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager",
      ],
      icon: <Crown className="w-4 h-4" />,
    },
  ]

  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-01-01",
      amount: "$199.00",
      status: "Paid",
      plan: "Enterprise",
    },
    {
      id: "INV-2023-012",
      date: "2023-12-01",
      amount: "$199.00",
      status: "Paid",
      plan: "Enterprise",
    },
    {
      id: "INV-2023-011",
      date: "2023-11-01",
      amount: "$199.00",
      status: "Paid",
      plan: "Enterprise",
    },
  ]

  const handlePlanChange = () => {
    console.log("Changing plan to:", selectedPlan, "billing:", billingCycle)
    // Here you would handle plan change
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log("Downloading invoice:", invoiceId)
    // Here you would handle invoice download
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Billing Management - {company.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {company.plan === "Enterprise" && <Crown className="w-5 h-5 text-purple-600" />}
                  {company.plan === "Professional" && <Star className="w-5 h-5 text-blue-600" />}
                  <div>
                    <h3 className="font-semibold text-lg">{company.plan} Plan</h3>
                    <p className="text-muted-foreground">{company.revenue}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Next Payment</p>
                  <p className="font-medium">Feb 15, 2024</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Billing Cycle</p>
                  <p className="font-medium">Monthly</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium">•••• 4242</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Auto Renewal</p>
                  <p className="font-medium">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Change Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label>Billing Cycle:</Label>
                <Select value={billingCycle} onValueChange={setBillingCycle}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                {billingCycle === "yearly" && <Badge className="bg-green-100 text-green-800">Save 20%</Badge>}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`cursor-pointer transition-all ${
                      selectedPlan === plan.name ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {plan.icon}
                            <h3 className="font-semibold">{plan.name}</h3>
                          </div>
                          <input
                            type="radio"
                            checked={selectedPlan === plan.name}
                            onChange={() => setSelectedPlan(plan.name)}
                            className="text-blue-600"
                          />
                        </div>
                        <div className="text-2xl font-bold">
                          ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedPlan !== company.plan && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-800">Plan change will take effect on your next billing cycle.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-3 w-3" />
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(invoice.date).toLocaleDateString()} • {invoice.plan} Plan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-medium">{invoice.amount}</p>
                        <Badge className="bg-green-100 text-green-800 text-xs">{invoice.status}</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
              Cancel Subscription
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="bg-transparent">
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
              {selectedPlan !== company.plan && (
                <Button onClick={handlePlanChange}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Plan
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
