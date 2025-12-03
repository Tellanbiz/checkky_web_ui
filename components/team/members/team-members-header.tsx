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
import {
  Plus,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface TeamMembersHeaderProps {
  onInviteMember: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function TeamMembersHeader({ onInviteMember, onRefresh, isLoading }: TeamMembersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input placeholder="Search team members..." className="pl-10" />
      </div>
      <div className="flex space-x-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
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
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
        <Button onClick={onInviteMember}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>
    </div>
  );
}
