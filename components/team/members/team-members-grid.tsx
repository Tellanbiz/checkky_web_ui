"use client";

import { TeamMember } from "@/lib/services/teams/data";
import { TeamMemberCard } from "./team-member-card";

interface TeamMembersGridProps {
  teamMembers: TeamMember[];
  onViewProfile: (member: TeamMember) => void;
  onEditRole: (member: TeamMember) => void;
  onSendMessage: (member: TeamMember) => void;
  onDeleteMember: (member: TeamMember) => void;
}

export function TeamMembersGrid({
  teamMembers,
  onViewProfile,
  onEditRole,
  onSendMessage,
  onDeleteMember,
}: TeamMembersGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teamMembers.map((member) => (
        <TeamMemberCard
          key={member.id}
          member={member}
          onViewProfile={onViewProfile}
          onEditRole={onEditRole}
          onSendMessage={onSendMessage}
          onDeleteMember={onDeleteMember}
        />
      ))}
    </div>
  );
}
