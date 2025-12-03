"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { TeamInvite } from "@/lib/services/teams/data";
import {
  getAllTeamInvites,
  inviteTeamMemberAction,
} from "@/lib/services/teams/actions";

// Query key for team invites
export const TEAM_INVITES_QUERY_KEY = ["team-invites"];

// Hook for fetching team invites
export function useTeamInvites() {
  return useQuery({
    queryKey: TEAM_INVITES_QUERY_KEY,
    queryFn: async () => {
      const teamInvites = await getAllTeamInvites();
      return teamInvites;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for inviting team members
export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inviteData: {
      email: string;
      role: "admin" | "auditor" | "assignee" | "viewer";
    }) => {
      const result = await inviteTeamMemberAction({
        invites: [inviteData],
      });
      return result;
    },
    onSuccess: (result, inviteData) => {
      if (result.success) {
        toast({
          title: "Invitation Sent",
          description: `Successfully sent invitation to ${inviteData.email}`,
        });
        // Invalidate and refetch invites
        queryClient.invalidateQueries({ queryKey: TEAM_INVITES_QUERY_KEY });
      } else {
        toast({
          title: "Invitation Failed",
          description:
            result.error || "Failed to send invitation. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while sending the invitation.",
        variant: "destructive",
      });
    },
  });
}

// Hook for resending team invites
export function useResendTeamInvite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invite: TeamInvite) => {
      const result = await inviteTeamMemberAction({
        invites: [
          {
            email: invite.email,
            role: invite.role as "admin" | "auditor" | "assignee" | "viewer",
          },
        ],
      });
      return { result, invite };
    },
    onSuccess: ({ result, invite }) => {
      if (result.success) {
        toast({
          title: "Invitation Resent",
          description: `Successfully resent invitation to ${invite.email}`,
        });
        // Invalidate and refetch invites
        queryClient.invalidateQueries({ queryKey: TEAM_INVITES_QUERY_KEY });
      } else {
        toast({
          title: "Resend Failed",
          description:
            result.error || "Failed to resend invitation. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Error resending invitation:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while resending the invitation.",
        variant: "destructive",
      });
    },
  });
}
