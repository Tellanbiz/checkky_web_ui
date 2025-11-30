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
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTeamMembersAction } from "@/lib/services/teams/actions";
import { TeamMember } from "@/lib/services/teams/data";
import { useToast } from "@/hooks/use-toast";

interface MembersTableFormProps {
  selectedMemberIds: string[];
  onMemberToggle: (memberId: string) => void;
}

export function MembersTableForm({
  selectedMemberIds,
  onMemberToggle,
}: MembersTableFormProps) {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const result = await getTeamMembersAction();
        if (result.success && result.data) {
          setMembers(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
        toast({
          title: "Error",
          description: "Failed to load team members. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [toast]);

  const filteredMembers = members.filter(
    (member) =>
      member.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "text-purple-400";
      case "auditor":
        return "text-blue-400";
      case "assignee":
        return "text-green-400";
      case "viewer":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          Team Member Assignment
        </CardTitle>
        <CardDescription className="text-sm">
          Select team members who will be responsible for this workflow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
            <div className="col-span-6">Member</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2 text-center">Role</div>
          </div>

          {/* Table Body */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-400">
                  Loading members...
                </span>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400">
                No members found
              </div>
            ) : (
              filteredMembers.map((member) => (
                <label
                  key={member.id}
                  className={cn(
                    "grid grid-cols-12 gap-2 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                    selectedMemberIds.includes(member.id)
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <Checkbox
                      checked={selectedMemberIds.includes(member.id)}
                      onCheckedChange={() => onMemberToggle(member.id)}
                      className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.user.picture} />
                      <AvatarFallback className="text-xs bg-gray-100">
                        {member.user.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        selectedMemberIds.includes(member.id)
                          ? "text-blue-600"
                          : "text-gray-900"
                      )}
                    >
                      {member.user.full_name}
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center text-sm text-gray-600 truncate">
                    {member.user.email}
                  </div>
                  <div
                    className={cn(
                      "col-span-2 flex items-center justify-center text-sm capitalize",
                      getRoleColor(member.role)
                    )}
                  >
                    {member.role}
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Selected Count */}
        {selectedMemberIds.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Selected:{" "}
            <span className="text-blue-600 font-medium">
              {selectedMemberIds.length} member(s)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
