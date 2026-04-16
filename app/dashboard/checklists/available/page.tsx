"use client";

import { AvailableChecklist } from "@/components/checklist/available-checklist";
import { useAvailableFilterActions } from "@/lib/provider/checklists/index";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MyChecklistsPage() {
  const availableActions = useAvailableFilterActions();
  const router = useRouter();

  const handleNewChecklist = () => {
    router.push("/dashboard/checklists/new");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search and Filter */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search checklists..."
            className="pl-10 bg-white w-full"
            onChange={(e) => availableActions.setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <div className="flex w-full sm:w-auto gap-2">
          <Button
            onClick={handleNewChecklist}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Upload New Checklist</span>
            <span className="sm:hidden">New Checklist</span>
          </Button>
        </div>
      </div>

      {/* Available Checklists Content */}
      <AvailableChecklist />
    </div>
  );
}
