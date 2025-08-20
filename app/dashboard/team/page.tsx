"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, Plus } from "lucide-react";
import { InviteMemberModal } from "@/components/team/invite-member-modal";
import { Page as TeamMemberPage } from "@/components/team/team-member-page";
import { Page as TeamInvitesPage } from "@/components/team/team-invites-page";

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleInviteSent = () => {
    console.log("Invitation sent, refreshing data...");
    // Here you would refresh the data
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Team Members</span>
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Team Invites</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <TeamMemberPage />
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <TeamInvitesPage />
        </TabsContent>
      </Tabs>

      {/* Invite Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}
