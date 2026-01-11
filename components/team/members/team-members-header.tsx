"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2 } from "lucide-react";

interface TeamMembersHeaderProps {
  onInviteMember: () => void;
  isLoading: boolean;
}

export function TeamMembersHeader({
  onInviteMember,
  isLoading,
}: TeamMembersHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search, Filters and Action Buttons Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4">
        <div className="relative w-full lg:max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search team members..."
            className="pl-10 w-full"
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full lg:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="auditor">Auditor</SelectItem>
              <SelectItem value="assignee">Assignee</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onInviteMember} className="flex-shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Invite Member</span>
            <span className="lg:hidden">Invite</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
