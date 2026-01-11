"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditsTabNavigationProps {
  activeTab: "ongoing" | "completed";
  onTabChange: (tab: "ongoing" | "completed") => void;
  onFilter?: () => void;
}

export function AuditsTabNavigation({
  activeTab,
  onTabChange,
  onFilter,
}: AuditsTabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tabs */}
        <nav className="-mb-px flex overflow-x-auto">
          <button
            onClick={() => onTabChange("ongoing")}
            className={`py-4 px-4 sm:px-8 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "ongoing"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Ongoing Audits
          </button>
          <button
            onClick={() => onTabChange("completed")}
            className={`py-4 px-4 sm:px-8 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "completed"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Completed Audits
          </button>
        </nav>
      </div>
    </div>
  );
}
