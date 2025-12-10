"use client";

import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/services/groups";

interface GroupSelectorProps {
  selectedGroupId: string;
  onGroupChange: (groupId: string) => void;
  disabled?: boolean;
}

export function GroupSelector({
  selectedGroupId,
  onGroupChange,
  disabled = false,
}: GroupSelectorProps) {
  // Fetch groups using TanStack Query
  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="group">Group (Optional)</Label>
      <select
        value={selectedGroupId}
        onChange={(e) => onGroupChange(e.target.value)}
        disabled={disabled || groupsLoading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="none">No group</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-muted-foreground">
        Optionally assign this checklist to a specific group for better
        organization
      </p>
    </div>
  );
}
