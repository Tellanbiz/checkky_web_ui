"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClipboardList, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvailableChecklistsForWorkflows } from "@/lib/services/workflows/hooks";
import { useToast } from "@/hooks/use-toast";

interface ChecklistTableFormProps {
  selectedChecklistId: string;
  onChecklistChange: (value: string) => void;
}

export function ChecklistTableForm({
  selectedChecklistId,
  onChecklistChange,
}: ChecklistTableFormProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: checklists = [],
    isLoading: loading,
    error,
  } = useAvailableChecklistsForWorkflows();

  const filteredChecklists = checklists.filter(
    (checklist) =>
      checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Checklist Template Selection
          </CardTitle>
          <CardDescription className="text-sm">
            Select the checklist template for this workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-red-600">
            Failed to load checklists. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Checklist Template Selection
        </CardTitle>
        <CardDescription className="text-sm">
          Select the checklist template for this workflow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search checklists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
            <div className="col-span-6">Template</div>
            <div className="col-span-6">Description</div>
          </div>

          {/* Table Body */}
          <RadioGroup
            value={selectedChecklistId}
            onValueChange={onChecklistChange}
          >
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm text-gray-400">
                    Loading checklists...
                  </span>
                </div>
              ) : filteredChecklists.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">
                  No checklists found
                </div>
              ) : (
                filteredChecklists.map((checklist) => (
                  <label
                    key={checklist.id}
                    className={cn(
                      "grid grid-cols-12 gap-2 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                      selectedChecklistId === checklist.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      <RadioGroupItem
                        value={checklist.id}
                        className="border-gray-300 text-blue-600"
                      />
                      <span
                        className={cn(
                          "text-sm font-medium truncate",
                          selectedChecklistId === checklist.id
                            ? "text-blue-600"
                            : "text-gray-900"
                        )}
                      >
                        {checklist.name}
                      </span>
                    </div>
                    <div className="col-span-6 flex items-center text-sm text-gray-600 truncate">
                      {checklist.description || "No description available"}
                    </div>
                  </label>
                ))
              )}
            </div>
          </RadioGroup>
        </div>

        {/* Selected Info */}
        {selectedChecklistId && (
          <div className="text-xs text-muted-foreground">
            Selected:{" "}
            <span className="text-blue-600 font-medium">
              {checklists.find((c) => c.id === selectedChecklistId)?.name}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
