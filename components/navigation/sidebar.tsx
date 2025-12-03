"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckSquare, Building } from "lucide-react";
import { useCompany } from "../../hooks/use-company";
import type { Company } from "@/lib/services/company/models";
import { updateCurrentCompanyAction } from "@/lib/services/company/actions";
import { useToast } from "@/hooks/use-toast";
import { navigation } from "./data";
import { Account } from "@/lib/services/accounts/models";

type SidebarProps = {
  initialCompanies?: Company[];
  account: Account | undefined;
};

export function Sidebar({ initialCompanies, account }: SidebarProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies ?? []);
  const [loading, setLoading] = useState<boolean>(!initialCompanies);
  const [error, setError] = useState<string | null>(null);

  const { currentCompany, currentCompanyId, setCurrentCompany } = useCompany();

  // Initialize current company
  useEffect(() => {
    if (initialCompanies?.length && !currentCompanyId) {
      const company =
        initialCompanies.find((c) => c.id === account?.current_company_id) ||
        initialCompanies[0];
      setCurrentCompany(company);
    }
    if (!initialCompanies?.length) {
      setError("No companies available");
      setLoading(false);
    }
  }, [
    initialCompanies,
    currentCompanyId,
    account?.current_company_id,
    setCurrentCompany,
  ]);

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 hidden md:flex">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CheckIt</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.title} className="space-y-2">
            {section.title && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                // Check if the current pathname exactly matches the navigation item
                // Use strict equality to prevent multiple items being active
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-[#16A34A] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Company Switcher */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Company</span>
            {companies.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full ml-auto">
                {companies.length}
              </span>
            )}
          </div>

          {/* Company Selector */}
          <Select
            value={currentCompanyId || ""}
            onValueChange={async (companyId) => {
              const selectedCompany = companies.find((c) => c.id === companyId);
              if (!selectedCompany) return;

              try {
                const success = await updateCurrentCompanyAction(companyId);
                if (success) {
                  setCurrentCompany(selectedCompany);
                  toast({
                    title: "Company Switched",
                    description: `Switched to ${selectedCompany.name}`,
                  });
                  window.location.reload();
                } else {
                  toast({
                    title: "Error",
                    description: "Failed to switch company. Please try again.",
                    variant: "destructive",
                  });
                }
              } catch (error) {
                console.error("Failed to switch company:", error);
                toast({
                  title: "Error",
                  description: "Failed to switch company. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            disabled={loading}
          >
            <SelectTrigger className="w-full h-9 text-sm border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <SelectValue
                placeholder={
                  loading ? "Loading companies..." : "Select company"
                }
              />
            </SelectTrigger>
            <SelectContent className="min-w-[200px]">
              {loading && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    <span>Loading companies...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="p-3 text-sm text-red-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              {!loading &&
                !error &&
                companies.map((company) => (
                  <SelectItem
                    key={company.id}
                    value={company.id}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 py-1">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="truncate font-medium">
                        {company.name}
                      </span>
                      {company.id === currentCompanyId && (
                        <span className="text-xs text-green-500 font-semibold">
                          ✓
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              {!loading && !error && companies.length === 0 && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span>📋</span>
                    <span>No companies available</span>
                  </div>
                </div>
              )}
            </SelectContent>
          </Select>

          {/* Current Company Display */}
          {currentCompany && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-700">
                  Active Company
                </span>
              </div>
              <div className="text-sm font-medium text-gray-800 truncate mt-1 pl-7">
                {currentCompany.name}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
