"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/lib/services/teams/data";
import {
  getTeamMembersAction,
} from "@/lib/services/teams/actions";

// Query key for team members
export const TEAM_MEMBERS_QUERY_KEY = ["team-members"];

// Hook for fetching team members
export function useTeamMembers() {
  return useQuery({
    queryKey: TEAM_MEMBERS_QUERY_KEY,
    queryFn: async () => {
      const result = await getTeamMembersAction();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || "Failed to fetch team members");
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for updating team member role (placeholder for future implementation)
export function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ memberId, newRole }: {
      memberId: string;
      newRole: "admin" | "auditor" | "assignee" | "viewer";
    }) => {
      // TODO: Implement the actual action for updating member role
      console.log("Updating role for member:", memberId, "to:", newRole);
      return { success: true, memberId, newRole };
    },
    onSuccess: (result, variables) => {
      toast({
        title: "Role Updated",
        description: `Successfully updated team member role`,
      });
      // Invalidate and refetch team members
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Error updating team member role:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while updating the team member role.",
        variant: "destructive",
      });
    },
  });
}

// Hook for removing team member (placeholder for future implementation)
export function useRemoveTeamMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (memberId: string) => {
      // TODO: Implement the actual action for removing team member
      console.log("Removing team member:", memberId);
      return { success: true, memberId };
    },
    onSuccess: (result, memberId) => {
      toast({
        title: "Member Removed",
        description: `Successfully removed team member`,
      });
      // Invalidate and refetch team members
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Error removing team member:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while removing the team member.",
        variant: "destructive",
      });
    },
  });
}
