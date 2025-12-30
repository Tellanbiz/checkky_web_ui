"use client";

import { Clock, CheckCircle, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditsTabNavigationProps {
  activeTab: 'ongoing' | 'completed';
  onTabChange: (tab: 'ongoing' | 'completed') => void;
  onRefresh?: () => void;
  onFilter?: () => void;
}

export function AuditsTabNavigation({
  activeTab,
  onTabChange,
  onRefresh,
  onFilter,
}: AuditsTabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onTabChange('ongoing')}
            className={`py-4 px-8 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'ongoing'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Ongoing Audits
            </div>
          </button>
          <button
            onClick={() => onTabChange('completed')}
            className={`py-4 px-8 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'completed'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed Audits
            </div>
          </button>
        </nav>

      </div>
    </div>
  );
}
