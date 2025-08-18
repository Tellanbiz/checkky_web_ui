"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/app/dashboard/components/header";
import { CompanySetupDialog } from "@/components/company/company-setup-dialog";
import type { Company, CompanyParams } from "@/lib/services/company/models";

interface DashboardWrapperProps {
  companies: Company[];
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export function DashboardWrapper({
  companies,
  loading,
  error,
  children,
}: DashboardWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentCompanies, setCurrentCompanies] =
    useState<Company[]>(companies);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("DashboardWrapper - Props received:", {
      companiesCount: companies.length,
      companies: companies,
      loading,
      error,
      pathname,
    });
  }, [companies, loading, error, pathname]);

  useEffect(() => {
    console.log("DashboardWrapper - Current state:", {
      currentCompaniesCount: currentCompanies.length,
      currentCompanies: currentCompanies,
    });
  }, [currentCompanies]);

  // Update currentCompanies when companies prop changes
  useEffect(() => {
    if (companies && companies.length > 0) {
      setCurrentCompanies(companies);
    }
  }, [companies]);

  // Combined redirect and dialog management
  useEffect(() => {
    const hasCompanies = currentCompanies.length > 0;
    const onCompanyCreatePage = pathname === "/dashboard/companies/new";
    if (loading) return;
    if (!hasCompanies && !onCompanyCreatePage) {
      router.replace("/dashboard/companies/new");
      return;
    }

    // Redirect away from creation if companies exist
    if (hasCompanies && onCompanyCreatePage) {
      router.replace("/dashboard");
      return;
    }

    // Manage dialog visibility only on /dashboard with no companies
    setShowCompanyDialog(!hasCompanies && pathname === "/dashboard");
  }, [loading, currentCompanies.length, pathname, router]);

  const handleCreateCompany = async (companyData: CompanyParams) => {
    try {
      // In a real app, you'd get the token from context or cookies
      // For now, we'll simulate the creation
      const newCompany: Company = {
        id: `company_${Date.now()}`,
        name: companyData.name,
        email: companyData.email,
        phone_number: companyData.phone_number,
        address: companyData.address,
        created_at: new Date().toISOString(),
      };

      setCurrentCompanies((prev) => [...prev, newCompany]);
      setShowCompanyDialog(false);

      // Redirect to dashboard after successful creation
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create company:", error);
      throw error;
    }
  };

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
        <Sidebar initialCompanies={currentCompanies} />
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
