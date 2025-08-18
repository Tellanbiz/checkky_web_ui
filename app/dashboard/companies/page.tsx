"use client";

import { CompanyDetailsModal } from "../components/modals/company-details-modal";
import { DeleteConfirmationModal } from "../components/modals/delete-confirmation-modal";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import {
  Plus,
  Search,
  Building2,
  Users,
  CheckSquare,
  Calendar,
  MoreHorizontal,
  Crown,
  Star,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditCompanyModal } from "../components/modals/edit-company-modal";
import { getAllCompanies } from "@/lib/services/company/actions";
import type { Company } from "@/lib/services/company/models";

export default function CompaniesPage() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] =
    useState<Company | null>(null);
  const [selectedCompanyForBilling, setSelectedCompanyForBilling] =
    useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const fetchedCompanies = await getAllCompanies();
        setCompanies(fetchedCompanies);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load companies"
        );
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowDetailsModal(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompanyForEdit(company);
    setShowEditModal(true);
  };

  const handleBilling = (company: Company) => {
    setSelectedCompanyForBilling(company);
    setShowBillingModal(true);
  };

  const handleExportData = (company: Company) => {
    console.log("Exporting data for:", company.name);
    // Here you would export company data
  };

  const handleSuspendCompany = (company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const confirmSuspend = () => {
    console.log("Suspending company:", companyToDelete);
    // Here you would actually suspend the company
  };

  const handleAddCompany = () => {
    router.push("/dashboard/companies/new");
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1" />
            {plan}
          </Badge>
        );
      case "Professional":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Star className="w-3 h-3 mr-1" />
            {plan}
          </Badge>
        );
      case "Starter":
        return <Badge variant="outline">{plan}</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-gray-500">Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold">Error loading companies</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Company Management
        </h2>
        <Button onClick={handleAddCompany}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search companies..." className="pl-10" />
        </div>
      </div>

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No companies found
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first company.
            </p>
            <Button onClick={handleAddCompany}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-[#16A34A] text-white font-semibold">
                        {company.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {company.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(company)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditCompany(company)}
                      >
                        Edit Company
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBilling(company)}>
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportData(company)}
                      >
                        Export Data
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleSuspendCompany(company)}
                      >
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
                    <Badge variant="outline">Standard</Badge>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>0 members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <span>0 checklists</span>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#16A34A] h-2 rounded-full transition-all"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>

                  {/* Contact Info and Join Date */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {company.phone_number && (
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span>{company.phone_number}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Joined:</span>
                      <span>
                        {new Date(company.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => handleViewDetails(company)}
                  >
                    Manage Company
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
      {selectedCompanyForEdit && (
        <EditCompanyModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          company={selectedCompanyForEdit}
        />
      )}

      {/* {selectedCompanyForBilling && (
        <CompanyBillingModal
          isOpen={showBillingModal}
          onClose={() => setShowBillingModal(false)}
          company={selectedCompanyForBilling}
        />
      )} */}
    </div>
  );
}
