"use client";

import { Clock, CheckCircle, Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChecklistTabNavigationProps {
  activeTab: 'ongoing' | 'completed';
  onTabChange: (tab: 'ongoing' | 'completed') => void;
  onAssignChecklist?: () => void;
  onUploadChecklist?: () => void;
}

export function ChecklistTabNavigation({
  activeTab,
  onTabChange,
  onAssignChecklist,
  onUploadChecklist,
}: ChecklistTabNavigationProps) {
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
              Ongoing Checklist
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
              Completed Checklist
            </div>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex gap-3 pr-4 md:pr-8">
          <Button
            onClick={onAssignChecklist}
            variant="outline"
            className="flex-shrink-0"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Assign Checklist
          </Button>
          <Button
            onClick={onUploadChecklist}
            className="flex-shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Upload New Checklist</span>
            <span className="lg:hidden">New Checklist</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
