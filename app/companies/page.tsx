"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building2, Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Company } from "@/lib/services/company/models";
import { updateCurrentCompanyAction } from "@/lib/services/company/actions";
import { getAllCompanies } from "@/lib/services/company/actions";
import { getAccount } from "@/lib/services/auth/auth-get";
import type { Account } from "@/lib/services/accounts/models";

export default function CompaniesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [processingCompanyId, setProcessingCompanyId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [companiesData, accountData] = await Promise.all([
          getAllCompanies(),
          getAccount(),
        ]);

        setCompanies(companiesData);
        setAccount(accountData);

        // Set the current company ID if account has one
        if (accountData?.current_company_id) {
          setSelectedCompanyId(accountData.current_company_id);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load companies. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleSelectCompany = async (companyId: string) => {
    try {
      setProcessingCompanyId(companyId);

      const success = await updateCurrentCompanyAction(companyId);

      if (success) {
        setSelectedCompanyId(companyId);
        toast({
          title: "Success",
          description: "Company selected successfully!",
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        throw new Error("Failed to update current company");
      }
    } catch (error) {
      console.error("Failed to select company:", error);
      toast({
        title: "Error",
        description: "Failed to select company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingCompanyId(null);
    }
  };

  const handleCreateCompany = () => {
    router.push("/dashboard/companies/new");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Your Companies
              </h1>
              <p className="text-gray-600 mt-2">
                Select a company to continue or create a new one
              </p>
            </div>
            <Button
              onClick={handleCreateCompany}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Company
            </Button>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => {
            const isSelected = selectedCompanyId === company.id;
            const isProcessing = processingCompanyId === company.id;

            return (
              <Card
                key={company.id}
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? "ring-2 ring-green-500 bg-green-50"
                    : "hover:ring-2 hover:ring-gray-200"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                      <CheckCircle className="mr-1 h-2 w-2" />
                      Current
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base text-gray-900">
                        {company.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-600">
                        {new Date(company.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {isSelected ? (
                    <Button
                      variant="outline"
                      className="w-full border-green-200 text-green-700 bg-green-50 h-9 text-sm"
                      disabled
                    >
                      <CheckCircle className="mr-2 h-3 w-3" />
                      Currently Selected
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelectCompany(company.id)}
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700 h-9 text-sm"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Selecting...
                        </>
                      ) : (
                        <>
                          Select Company
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {companies.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No companies yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first company
            </p>
            <Button
              onClick={handleCreateCompany}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Company
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
