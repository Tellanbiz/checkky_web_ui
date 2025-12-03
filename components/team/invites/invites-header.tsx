"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface InvitesHeaderProps {
  onInviteMember: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function InvitesHeader({ onInviteMember, onRefresh, isRefreshing }: InvitesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input placeholder="Search invites..." className="pl-10" />
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
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
