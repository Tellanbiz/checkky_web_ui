"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TeamMember } from "@/lib/services/teams/data";
import {
  getRoleIcon,
  getRoleBadgeColor,
  getRoleDisplayName,
} from "./role-utils";

interface TeamMemberCardProps {
  member: TeamMember;
  onViewProfile: (member: TeamMember) => void;
  onEditRole: (member: TeamMember) => void;
  onSendMessage: (member: TeamMember) => void;
  onDeleteMember: (member: TeamMember) => void;
}

export function TeamMemberCard({
  member,
  onViewProfile,
  onEditRole,
  onSendMessage,
  onDeleteMember,
}: TeamMemberCardProps) {
  return (
    <Card key={member.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {member.user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{member.user.full_name}</h3>
              <p className="text-sm text-muted-foreground">
                {member.user.email}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditRole(member)}>
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDeleteMember(member)}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Role */}
          <div className="flex items-center space-x-2">
            {getRoleIcon(member.role)}
            <Badge className={getRoleBadgeColor(member.role)}>
              {getRoleDisplayName(member.role)}
            </Badge>
          </div>

          {/* Task Stats */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tasks Completed</span>
              <span className="font-medium">
                {member.checklist_stats.completed}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  member.checklist_stats.total > 0
                    ? member.checklist_stats.completed /
                        member.checklist_stats.total >=
                      0.9
                      ? "bg-green-500"
                      : member.checklist_stats.completed /
                          member.checklist_stats.total >=
                        0.8
                      ? "bg-blue-500"
                      : member.checklist_stats.completed /
                          member.checklist_stats.total >=
                        0.7
                      ? "bg-yellow-500"
                      : "bg-red-500"
                    : "bg-gray-400"
                }`}
                style={{
                  width:
                    member.checklist_stats.total > 0
                      ? `${
                          (member.checklist_stats.completed /
                            member.checklist_stats.total) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* Task Stats */}
          <div className="flex justify-between text-sm">
            <span>
              Tasks: {member.checklist_stats.completed}/
              {member.checklist_stats.total}
            </span>
            <span className="text-muted-foreground">
              Pending: {member.checklist_stats.pending}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
