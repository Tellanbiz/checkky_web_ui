"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/header";
import { CompanySetupDialog } from "@/components/company/company-setup-dialog";
import type { Company, CompanyParams } from "@/lib/services/company/models";
import {
  createCompanyAction,
  updateCurrentCompanyAction,
} from "@/lib/services/company/actions";
import { useToast } from "@/hooks/use-toast";
import { useCompanies } from "@/hooks/use-companies";
import { useCreateCompany } from "@/hooks/use-create-company";
import { Account } from "@/lib/services/accounts/models";
import { getAccount } from "@/lib/services/auth/auth-get";
import { Menu, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { data: companies = [], isLoading: loading, error } = useCompanies();
  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
  } = useQuery<Account>({
    queryKey: ["account"],
    queryFn: getAccount,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
  const createCompanyMutation = useCreateCompany();
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Redirect to auth on error (account fetch failure or unauthorized)
  useEffect(() => {
    if (accountError) {
      router.replace("/auth");
    }
    if (error && /unauthorized|401/i.test(error.message)) {
      router.replace("/auth");
    }
  }, [error, accountError, router]);

  // Combined redirect and dialog management
  useEffect(() => {
    const hasCompanies = companies.length > 0;
    const onDashboardPage = pathname === "/dashboard";
    const onOnboardingPage = pathname === "/dashboard/onboarding";
    if (loading) return;

    // If unauthorized, let the other effect handle redirect
    if (error && /unauthorized|401/i.test(error.message)) return;

    if (!hasCompanies) {
      if (account?.onboarding_required) {
        if (!onDashboardPage && !onOnboardingPage) {
          router.replace("/dashboard");
        }
        setShowCompanyDialog(false);
        return;
      }

      if (!onDashboardPage) {
        router.replace("/dashboard");
        return;
      }

      setShowCompanyDialog(true);
      return;
    }

    // Check if user has companies but none selected
    if (hasCompanies && account && !account.current_company_id) {
      router.replace("/dashboard");
      return;
    }

    setShowCompanyDialog(false);
  }, [loading, companies.length, pathname, router, error, account]);

  // Handle mobile sidebar close event
  useEffect(() => {
    const handleMobileSidebarClose = () => {
      setMobileSidebarOpen(false);
    };

    window.addEventListener("closeMobileSidebar", handleMobileSidebarClose);
    return () => {
      window.removeEventListener(
        "closeMobileSidebar",
        handleMobileSidebarClose,
      );
    };
  }, []);

  const handleCreateCompany = async (companyData: CompanyParams) => {
    try {
      const success = await createCompanyMutation.mutateAsync(companyData);

      if (!success) {
        throw new Error("Failed to create company");
      }

      setShowCompanyDialog(false);
      toast({
        title: "Success",
        description: `Company "${companyData.name}" created successfully!`,
      });

      // Redirect to dashboard after successful creation
      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to create company:", error);
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Early return: if unauthorized or account error, show brief redirect UI
  if (accountError || (error && /unauthorized|401/i.test(error.message))) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading while account is being fetched
  if (accountLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // While deciding the first-time route, keep the transition quiet.
  if (!loading && companies.length === 0 && pathname !== "/dashboard") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to company setup...</p>
        </div>
      </div>
    );
  }

  // If we have companies, show the normal dashboard layout
  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 text-white flex items-center justify-center">
                ✓
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">Checkky</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar account={account} mobile={true} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        {loading ? (
          <div className="flex items-center justify-center w-64 bg-white border-r border-gray-200">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">
                Loading companies...
              </span>
            </div>
          </div>
        ) : (
          <Sidebar account={account} />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 min-w-0">
        <Header
          onMenuClick={() => setMobileSidebarOpen(true)}
          showMenuButton={true}
        />
        <main className="flex-1 overflow-x-hidden bg-white ">{children}</main>
      </div>

      {/* Show company setup dialog if no companies and on dashboard page */}
      {showCompanyDialog &&
        !loading &&
        companies.length === 0 &&
        pathname === "/dashboard" && (
          <CompanySetupDialog onCreateCompany={handleCreateCompany} />
        )}
    </div>
  );
}
