"use client";

import { CompanyDetailsModal } from "@/components/modals/company-details-modal";
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
  Calendar,
  Crown,
  Star,
  Loader2,
} from "lucide-react";
import { getAllCompaniesWithStats } from "@/lib/services/company/actions";
import type { CompanyWithStats } from "@/lib/services/company/models";
import { CompanyNewDialog } from "@/components/company/company_new_dialog";

export default function CompaniesPage() {
  const router = useRouter();
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
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search companies..." className="pl-10" />
        </div>
        <Button onClick={handleAddCompany}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
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
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    {getPlanBadge(company.plan)}
                    {getStatusBadge(company.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <CompanyNewDialog
        isOpen={showNewCompanyDialog}
        onClose={() => setShowNewCompanyDialog(false)}
        onSuccess={handleCompanyCreated}
      />
    </div>
  );
}
