"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/app/dashboard/components/header";
import { CompanySetupDialog } from "@/components/company/company-setup-dialog";
import type { Company, CompanyParams } from "@/lib/services/company/models";
import {
  createCompanyAction,
  updateCurrentCompanyAction,
} from "@/lib/services/company/actions";
import { useToast } from "@/hooks/use-toast";
import { Account } from "@/lib/services/accounts/models";

interface DashboardWrapperProps {
  companies: Company[];
  account: Account | undefined;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export function DashboardWrapper({
  companies,
  account,
  loading,
  error,
  children,
}: DashboardWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [currentCompanies, setCurrentCompanies] =
    useState<Company[]>(companies);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);

  useEffect(() => {
    if (companies && companies.length > 0) {
      setCurrentCompanies(companies);
    }
  }, [companies]);

  // Redirect to login on unauthorized errors
  useEffect(() => {
    if (error && /unauthorized|401/i.test(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  // Combined redirect and dialog management
  useEffect(() => {
    const hasCompanies = currentCompanies.length > 0;
    const onCompanyCreatePage = pathname === "/dashboard/companies/new";
    const onCompaniesPage = pathname === "/companies";
    if (loading) return;

    // If unauthorized, let the other effect handle redirect
    if (error && /unauthorized|401/i.test(error)) return;

    if (!hasCompanies && !onCompanyCreatePage) {
      router.replace("/dashboard/companies/new");
      return;
    }

    // Redirect away from creation if companies exist
    if (hasCompanies && onCompanyCreatePage) {
      router.replace("/dashboard");
      return;
    }

    // Check if user has companies but none selected
    if (
      hasCompanies &&
      account &&
      !account.current_company_id &&
      !onCompaniesPage
    ) {
      router.replace("/companies");
      return;
    }

    // Manage dialog visibility only on /dashboard with no companies
    setShowCompanyDialog(!hasCompanies && pathname === "/dashboard");
  }, [loading, currentCompanies.length, pathname, router, error, account]);

  const handleCreateCompany = async (companyData: CompanyParams) => {
    try {
      // Create the company using the proper action
      const success = await createCompanyAction(companyData);
      if (!success) {
        throw new Error("Failed to create company");
      }

      // Refresh the companies list
      // Note: In a real app, you might want to refetch the companies
      // For now, we'll simulate adding the new company
      const newCompany: Company = {
        id: `company_${Date.now()}`, // This would come from the API response
        name: companyData.name,
        created_at: new Date().toISOString(),
      };

      setCurrentCompanies((prev) => [...prev, newCompany]);
      setShowCompanyDialog(false);

      // Set the newly created company as the current company
      const currentCompanySuccess = await updateCurrentCompanyAction(
        newCompany.id
      );
      if (currentCompanySuccess) {
        toast({
          title: "Success",
          description: `Company "${newCompany.name}" created and set as active!`,
        });
      } else {
        toast({
          title: "Company Created",
          description: `Company "${newCompany.name}" created successfully!`,
        });
      }

      // Redirect to dashboard after successful creation
      router.push("/dashboard");
    } catch (error) {
      console.log(error);

      console.error("Failed to create company:", error);
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Early return: if unauthorized, show brief redirect UI
  if (error && /unauthorized|401/i.test(error)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If no companies and not on company creation page, show loading
  if (
    !loading &&
    currentCompanies.length === 0 &&
    pathname !== "/dashboard/companies/new"
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to company setup...</p>
        </div>
      </div>
    );
  }

  // If on company creation page, don't show the dashboard layout
  if (pathname === "/dashboard/companies/new") {
    return <>{children}</>;
  }

  // If we have companies, show the normal dashboard layout
  return (
    <div className="flex h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Loading companies...</span>
          </div>
        </div>
      ) : (
        <Sidebar initialCompanies={currentCompanies} account={account} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          {children}
        </main>
      </div>

      {/* Show company setup dialog if no companies and on dashboard page */}
      {showCompanyDialog &&
        !loading &&
        currentCompanies.length === 0 &&
        pathname === "/dashboard" && (
          <CompanySetupDialog onCreateCompany={handleCreateCompany} />
        )}
    </div>
  );
}
