"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Upload, Plus, X, Crown, Star } from "lucide-react"
import { useState } from "react"

interface AddCompanyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddCompanyModal({ isOpen, onClose }: AddCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    size: "",
    plan: "",
    adminName: "",
    adminEmail: "",
    description: "",
  })

  const plans = [
    {
      name: "Starter",
      price: "$29/month",
      features: ["Up to 10 team members", "Basic checklists", "Email support"],
      badge: null,
    },
    {
      name: "Professional",
      price: "$99/month",
      features: ["Up to 50 team members", "Advanced analytics", "Priority support", "Custom guidelines"],
      badge: <Star className="w-3 h-3" />,
    },
    {
      name: "Enterprise",
      price: "$199/month",
      features: ["Unlimited team members", "Full admin controls", "24/7 support", "Custom integrations"],
      badge: <Crown className="w-3 h-3" />,
    },
  ]

  const handleSubmit = () => {
    console.log("Creating company:", formData)
    onClose()
    // Here you would create the company
  }

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Company Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter company name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Livestock">Livestock</SelectItem>
                      <SelectItem value="Crop Farming">Crop Farming</SelectItem>
                      <SelectItem value="Flower Farming">Flower Farming</SelectItem>
                      <SelectItem value="Mixed Agriculture">Mixed Agriculture</SelectItem>
                      <SelectItem value="Food Processing">Food Processing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Company Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select value={formData.size} onValueChange={(value) => updateFormData("size", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="200+">200+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter company address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the company"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin User */}
          <Card>
            <CardHeader>
              <CardTitle>Primary Administrator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Admin Name *</Label>
                  <Input
                    id="adminName"
                    placeholder="John Doe"
                    value={formData.adminName}
                    onChange={(e) => updateFormData("adminName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@company.com"
                    value={formData.adminEmail}
                    onChange={(e) => updateFormData("adminEmail", e.target.value)}
                  />
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  This person will receive admin access and setup instructions via email.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`cursor-pointer transition-all ${
                      formData.plan === plan.name ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => updateFormData("plan", plan.name)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center space-x-2">
                          {plan.badge && (
                            <Badge
                              className={
                                plan.name === "Enterprise"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {plan.badge}
                              {plan.name}
                            </Badge>
                          )}
                          {!plan.badge && <Badge variant="outline">{plan.name}</Badge>}
                        </div>
                        <div className="text-2xl font-bold">{plan.price}</div>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-[#16A34A] text-white font-semibold text-lg">
                    {formData.name ? formData.name.substring(0, 2).toUpperCase() : "CO"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.name ||
                !formData.industry ||
                !formData.email ||
                !formData.adminName ||
                !formData.adminEmail ||
                !formData.plan
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Company
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
