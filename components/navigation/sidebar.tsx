"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  FileText,
  Building2,
  Shield,
  MessageSquare,
  MapPin,
  Building,
} from "lucide-react";
import { useCompany } from "../../hooks/use-company";
import type { Company } from "@/lib/services/company/models";

type SidebarProps = {
  initialCompanies?: Company[];
};

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Checklists",
    href: "/dashboard/checklists",
    icon: CheckSquare,
    badge: "12",
  },
  {
    name: "Farm Sections",
    href: "/dashboard/sections",
    icon: MapPin,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    name: "Team Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
    badge: "3",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Companies",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    name: "Guidelines",
    href: "/dashboard/guidelines",
    icon: FileText,
  },
  {
    name: "Admin Tools",
    href: "/dashboard/admin",
    icon: Shield,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ initialCompanies }: SidebarProps) {
  const pathname = usePathname();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies ?? []);
  const [loading, setLoading] = useState<boolean>(!initialCompanies);
  const [error, setError] = useState<string | null>(null);

  const {
    currentCompany,
    currentCompanyId,
    setCurrentCompany,
    setCurrentCompanyId,
  } = useCompany();

  // If we have initial companies and no current company selected, select first
  useEffect(() => {
    if (initialCompanies && initialCompanies.length > 0 && !currentCompanyId) {
      setCurrentCompany(initialCompanies[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only run initialization logic if no initial companies were provided
  useEffect(() => {
    if (!initialCompanies || initialCompanies.length === 0) {
      // If no initial companies, we could show an error or fallback
      setError("No companies available");
      setLoading(false);
    }
  }, [initialCompanies]);

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
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
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
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="ml-auto bg-gray-100 text-gray-600 flex-shrink-0"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Company Switcher */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Company</span>
            </div>
            {companies.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {companies.length}
              </span>
            )}
          </div>

          {/* Company Selector */}
          <Select
            value={currentCompanyId || ""}
            onValueChange={(companyId) => {
              const selectedCompany = companies.find((c) => c.id === companyId);
              if (selectedCompany) {
                setCurrentCompany(selectedCompany);
                // Refresh the page to update context
                window.location.reload();
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
              {loading ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    <span>Loading companies...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="p-3 text-sm text-red-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <SelectItem
                    key={company.id}
                    value={company.id}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 py-1">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Building className="w-3 h-3 text-green-600" />
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
                ))
              ) : (
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
                  <Building className="w-3 h-3 text-white" />
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
