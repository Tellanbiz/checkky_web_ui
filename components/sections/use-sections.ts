"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Section } from "@/lib/services/sections/models";
import {
  getSections,
} from "@/lib/services/sections/get";

// Query key for sections
export const SECTIONS_QUERY_KEY = ["sections"];

// Hook for fetching sections
export function useSections() {
  return useQuery({
    queryKey: SECTIONS_QUERY_KEY,
    queryFn: async () => {
      const sections = await getSections();
      return sections;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for updating section (placeholder for future implementation)
export function useUpdateSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updatedSection: Section) => {
      // TODO: Implement the actual action for updating section
      console.log("Updating section:", updatedSection);
      return { success: true, section: updatedSection };
    },
    onSuccess: (result, updatedSection) => {
      toast({
        title: "Section Updated",
        description: `Section "${updatedSection.name}" updated successfully.`,
      });
      // Update the cache with the new section data
      queryClient.setQueryData(
        SECTIONS_QUERY_KEY,
        (oldData: Section[] | undefined) => {
          if (!oldData) return [updatedSection];
          return oldData.map((section) =>
            section.id === updatedSection.id ? updatedSection : section
          );
        }
      );
    },
    onError: (error) => {
      console.error("Error updating section:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while updating the section.",
        variant: "destructive",
      });
    },
  });
}

// Hook for deleting section (placeholder for future implementation)
export function useDeleteSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sectionId: string) => {
      // TODO: Implement the actual action for deleting section
      console.log("Deleting section:", sectionId);
      return { success: true, sectionId };
    },
    onSuccess: (result, sectionId) => {
      toast({
        title: "Section Deleted",
        description: `Section deleted successfully.`,
      });
      // Remove the section from the cache
      queryClient.setQueryData(
        SECTIONS_QUERY_KEY,
        (oldData: Section[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((section) => section.id !== sectionId);
        }
      );
    },
    onError: (error) => {
      console.error("Error deleting section:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while deleting the section.",
        variant: "destructive",
      });
    },
  });
}

// Hook for creating section (placeholder for future implementation)
export function useCreateSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newSection: Omit<Section, "id">) => {
      // TODO: Implement the actual action for creating section
      console.log("Creating section:", newSection);
      const sectionWithId: Section = {
        ...newSection,
        id: Date.now().toString(), // Temporary ID generation
      };
      return { success: true, section: sectionWithId };
    },
    onSuccess: (result, newSection) => {
      toast({
        title: "Section Created",
        description: `Section "${newSection.name}" created successfully.`,
      });
      // Add the new section to the cache
      queryClient.setQueryData(
        SECTIONS_QUERY_KEY,
        (oldData: Section[] | undefined) => {
          if (!oldData) return [result.section];
          return [...oldData, result.section];
        }
      );
    },
    onError: (error) => {
      console.error("Error creating section:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while creating the section.",
        variant: "destructive",
      });
    },
  });
}
