"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FolderOpen, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/services/groups";

interface Group {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  no_of_checklists: number;
  company_id: string;
}

interface GroupTableSelectorProps {
  selectedGroupId: string;
  onGroupChange: (value: string) => void;
  disabled?: boolean;
}

export function GroupTableSelector({
  selectedGroupId,
  onGroupChange,
  disabled = false,
}: GroupTableSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: groups = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredGroups = groups.filter(
    (group: Group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-center py-8 text-sm text-red-600">
        Failed to load groups. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-9 text-sm"
          disabled={disabled}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
          <div className="col-span-6">Group</div>
          <div className="col-span-6">Description</div>
        </div>

        {/* Table Body */}
        <RadioGroup
          value={selectedGroupId === "none" ? "" : selectedGroupId}
          onValueChange={onGroupChange}
        >
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-400">
                  Loading groups...
                </span>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400">
                No groups found
              </div>
            ) : (
              <>
                {/* "No group" option */}
                <label
                  className={cn(
                    "grid grid-cols-12 gap-2 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                    selectedGroupId === "none"
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <RadioGroupItem
                      value=""
                      className="border-gray-300 text-blue-600"
                    />
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        selectedGroupId === "none"
                          ? "text-blue-600"
                          : "text-gray-900"
                      )}
                    >
                      No group
                    </span>
                  </div>
                  <div className="col-span-6 flex items-center text-sm text-gray-600 truncate">
                    Don't assign to any group
                  </div>
                </label>

                {/* Group options */}
                {filteredGroups.map((group: Group) => (
                  <label
                    key={group.id}
                    className={cn(
                      "grid grid-cols-12 gap-2 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                      selectedGroupId === group.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      <RadioGroupItem
                        value={group.id}
                        className="border-gray-300 text-blue-600"
                      />
                      <span
                        className={cn(
                          "text-sm font-medium truncate",
                          selectedGroupId === group.id
                            ? "text-blue-600"
                            : "text-gray-900"
                        )}
                      >
                        {group.name}
                      </span>
                    </div>
                    <div className="col-span-6 flex items-center text-sm text-gray-600 truncate">
                      {group.description || "No description available"}
                    </div>
                  </label>
                ))}
              </>
            )}
          </div>
        </RadioGroup>
      </div>

      {/* Selected Info */}
      {selectedGroupId && selectedGroupId !== "none" && (
        <div className="text-xs text-muted-foreground">
          Selected:{" "}
          <span className="text-blue-600 font-medium">
            {groups.find((g: Group) => g.id === selectedGroupId)?.name}
          </span>
        </div>
      )}
    </div>
  );
}
