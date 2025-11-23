"use client";

import { CompanyDetailsModal } from "../components/modals/company-details-modal";
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
import { getAllCompaniesWithStats } from "@/lib/services/company/actions";
import type { CompanyWithStats } from "@/lib/services/company/models";
import { DeleteConfirmationModal } from "@/components/team/delete-confirmation-modal";
import { CompanyNewDialog } from "@/components/company/company_new_dialog";

export default function CompaniesPage() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyWithStats | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] =
    useState<CompanyWithStats | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] =
    useState<CompanyWithStats | null>(null);
  const [selectedCompanyForBilling, setSelectedCompanyForBilling] =
    useState<CompanyWithStats | null>(null);
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const fetchedCompanies = await getAllCompaniesWithStats();
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

  const handleViewDetails = (company: CompanyWithStats) => {
    setSelectedCompany(company);
    setShowDetailsModal(true);
  };

  const handleEditCompany = (company: CompanyWithStats) => {
    setSelectedCompanyForEdit(company);
    setShowEditModal(true);
  };

  const handleBilling = (company: CompanyWithStats) => {
    setSelectedCompanyForBilling(company);
    setShowBillingModal(true);
  };

  const handleExportData = (company: CompanyWithStats) => {
    console.log("Exporting data for:", company.name);
    // Here you would export company data
  };

  const handleSuspendCompany = (company: CompanyWithStats) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const confirmSuspend = () => {
    console.log("Suspending company:", companyToDelete);
    // Here you would actually suspend the company
  };

  const handleAddCompany = () => {
    setShowNewCompanyDialog(true);
  };

  const handleCompanyCreated = () => {
    // Refresh the companies list
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const fetchedCompanies = await getAllCompaniesWithStats();
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            {status}
          </Badge>
        );
      case "Inactive":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">{status}</Badge>
        );
      case "Suspended":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#16A34A] text-white font-semibold text-sm">
                        {company.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{company.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(company.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-3 w-3" />
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
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    {getPlanBadge(company.plan)}
                    {getStatusBadge(company.status)}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{company.member_count} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckSquare className="h-3 w-3 text-muted-foreground" />
                      <span>{company.checklist_count} checklists</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-transparent h-8 text-xs"
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

      <CompanyNewDialog
        isOpen={showNewCompanyDialog}
        onClose={() => setShowNewCompanyDialog(false)}
        onSuccess={handleCompanyCreated}
      />
    </div>
  );
}
