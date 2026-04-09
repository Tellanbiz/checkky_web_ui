"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Building } from "lucide-react";
import type { Company } from "@/lib/services/company/models";

interface CompanySwitcherProps {
  companies: Company[];
  currentCompany: Company | null;
  currentCompanyId: string | null;
  loading: boolean;
  errorMessage: string | null;
  collapsed?: boolean;
  onSwitch: (companyId: string) => void;
}

export function CompanySwitcher({
  companies,
  currentCompany,
  currentCompanyId,
  loading,
  errorMessage,
  collapsed = false,
  onSwitch,
}: CompanySwitcherProps) {
  if (collapsed) {
    return (
      <div className="px-1.5 py-2 border-t border-gray-100">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center w-full h-8 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <Building className="w-4 h-4 text-gray-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <p className="font-medium">
              {currentCompany?.name || "Select company"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="px-2 py-3 border-t border-gray-100">
      <div className="space-y-2">
        <Select
          value={currentCompanyId || ""}
          onValueChange={onSwitch}
          disabled={loading}
        >
          <SelectTrigger className="w-full h-8 text-[12px] border-gray-200 rounded-md hover:border-gray-300 focus:ring-1 focus:ring-gray-200">
            <SelectValue
              placeholder={loading ? "Loading..." : "Select company"}
            />
          </SelectTrigger>
          <SelectContent className="min-w-[200px]">
            {loading && (
              <div className="p-3 text-sm text-gray-500 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
                  <span>Loading companies...</span>
                </div>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 text-sm text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            {!loading &&
              !errorMessage &&
              companies.map((company) => (
                <SelectItem
                  key={company.id}
                  value={company.id}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 py-0.5">
                    <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                      <Building className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="truncate font-medium text-[12px] text-gray-800">
                      {company.name}
                    </span>
                    {company.id === currentCompanyId && (
                      <span className="text-[10px] text-gray-500 font-semibold ml-auto">
                        ✓
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            {!loading && !errorMessage && companies.length === 0 && (
              <div className="p-3 text-sm text-gray-500 text-center">
                No companies available
              </div>
            )}
          </SelectContent>
        </Select>

        {currentCompany && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-gray-50 border border-gray-100">
            <div className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
              <Building className="w-3 h-3 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-gray-900 truncate">
                {currentCompany.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
