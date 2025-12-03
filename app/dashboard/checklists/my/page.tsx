"use client";

import { AvailableChecklist } from "@/components/checklist/available-checklist";
import { useAvailableFilterActions } from "@/lib/provider/checklists/index";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function MyChecklistsPage() {
  const availableActions = useAvailableFilterActions();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header with Search */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search checklists..."
              className="pl-10 bg-white"
              onChange={(e) => availableActions.setSearchTerm(e.target.value)}
            />
          </div>

        
        </div>
      </div>

      {/* Available Checklists Content */}
      <AvailableChecklist />
    </div>
  );
}