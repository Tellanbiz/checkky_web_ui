"use client"

import { CompanyDetailsModal } from "../components/modals/company-details-modal"
import { DeleteConfirmationModal } from "../components/modals/delete-confirmation-modal"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Building2, Users, CheckSquare, Calendar, MoreHorizontal, Crown, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddCompanyModal } from "../components/modals/add-company-modal"
import { EditCompanyModal } from "../components/modals/edit-company-modal"
import { CompanyBillingModal } from "../components/modals/company-billing-modal"

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<any>(null)
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState<any>(null)
  const [selectedCompanyForBilling, setSelectedCompanyForBilling] = useState<any>(null)

  const companies = [
    {
      id: 1,
      name: "Green Valley Farms",
      industry: "Livestock",
      plan: "Enterprise",
      members: 24,
      checklists: 127,
      completion: 89,
      joinDate: "2023-01-15",
      status: "Active",
      logo: "GV",
      revenue: "$2,400/mo",
    },
    {
      id: 2,
      name: "Sunrise Agriculture Co.",
      industry: "Crop Farming",
      plan: "Professional",
      members: 18,
      checklists: 89,
      completion: 92,
      joinDate: "2023-03-22",
      status: "Active",
      logo: "SA",
      revenue: "$1,200/mo",
    },
    {
      id: 3,
      name: "Bloom & Blossom",
      industry: "Flower Farming",
      plan: "Starter",
      members: 8,
      checklists: 45,
      completion: 85,
      joinDate: "2023-06-10",
      status: "Trial",
      logo: "BB",
      revenue: "$0/mo",
    },
    {
      id: 4,
      name: "Heritage Livestock Ranch",
      industry: "Livestock",
      plan: "Enterprise",
      members: 32,
      checklists: 156,
      completion: 94,
      joinDate: "2022-11-08",
      status: "Active",
      logo: "HL",
      revenue: "$2,400/mo",
    },
    {
      id: 5,
      name: "Organic Harvest Inc.",
      industry: "Crop Farming",
      plan: "Professional",
      members: 15,
      checklists: 78,
      completion: 88,
      joinDate: "2023-04-18",
      status: "Active",
      logo: "OH",
      revenue: "$1,200/mo",
    },
    {
      id: 6,
      name: "Mountain View Dairy",
      industry: "Livestock",
      plan: "Professional",
      members: 12,
      checklists: 67,
      completion: 76,
      joinDate: "2023-08-05",
      status: "Inactive",
      logo: "MV",
      revenue: "$0/mo",
    },
  ]

  const handleViewDetails = (company: any) => {
    setSelectedCompany(company)
    setShowDetailsModal(true)
  }

  const handleEditCompany = (company: any) => {
    setSelectedCompanyForEdit(company)
    setShowEditModal(true)
  }

  const handleBilling = (company: any) => {
    setSelectedCompanyForBilling(company)
    setShowBillingModal(true)
  }

  const handleExportData = (company: any) => {
    console.log("Exporting data for:", company.name)
    // Here you would export company data
  }

  const handleSuspendCompany = (company: any) => {
    setCompanyToDelete(company)
    setShowDeleteModal(true)
  }

  const confirmSuspend = () => {
    console.log("Suspending company:", companyToDelete)
    // Here you would actually suspend the company
  }

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
      case "Starter":
        return <Badge variant="outline">{plan}</Badge>
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Company Management</h2>
        <Button onClick={() => setShowAddCompanyModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Company Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">83% active rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,200</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Companies</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Bloom & Blossom</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search companies..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="livestock">Livestock</SelectItem>
            <SelectItem value="crop">Crop Farming</SelectItem>
            <SelectItem value="flower">Flower Farming</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-[#16A34A] text-white font-semibold">{company.logo}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(company)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditCompany(company)}>Edit Company</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBilling(company)}>Billing</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportData(company)}>Export Data</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleSuspendCompany(company)}>
                      Suspend
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Plan and Status */}
                <div className="flex items-center justify-between">
                  {getPlanBadge(company.plan)}
                  <Badge
                    variant={
                      company.status === "Active" ? "default" : company.status === "Trial" ? "secondary" : "outline"
                    }
                    className={
                      company.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : company.status === "Trial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {company.status}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{company.members} members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{company.checklists} checklists</span>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">{company.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#16A34A] h-2 rounded-full transition-all"
                      style={{ width: `${company.completion}%` }}
                    />
                  </div>
                </div>

                {/* Revenue and Join Date */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Revenue: {company.revenue}</span>
                  <span>Joined: {new Date(company.joinDate).toLocaleDateString()}</span>
                </div>

                <Button className="w-full bg-transparent" variant="outline" onClick={() => handleViewDetails(company)}>
                  Manage Company
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Modals */}
      {selectedCompany && (
        <CompanyDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          company={selectedCompany}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmSuspend}
        title="Suspend Company"
        description="Are you sure you want to suspend this company? They will lose access to the platform."
        itemName={companyToDelete?.name || ""}
      />
      <AddCompanyModal isOpen={showAddCompanyModal} onClose={() => setShowAddCompanyModal(false)} />
      {selectedCompanyForEdit && (
        <EditCompanyModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          company={selectedCompanyForEdit}
        />
      )}

      {selectedCompanyForBilling && (
        <CompanyBillingModal
          isOpen={showBillingModal}
          onClose={() => setShowBillingModal(false)}
          company={selectedCompanyForBilling}
        />
      )}
    </div>
  )
}
