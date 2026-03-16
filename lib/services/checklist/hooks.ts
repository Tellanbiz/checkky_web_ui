"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssignedChecklists } from "./get";
import { updateAssignedPriority } from "./post";
import { createChecklistWithProgress, deleteUploadedChecklist } from "./client";
import { AssignedChecklist } from "./models";

export const useAssignedChecklists = (status?: string) => {
  return useQuery({
    queryKey: ["assigned-checklists", status],
    queryFn: () => getAssignedChecklists(),
    select: (data) => {
      if (status && status !== "all") {
        return data.filter(checklist => checklist.status === status);
      }
      return data;
    },
  });
};

export const useUpdateChecklistPriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ checklistId, newPriority }: { checklistId: string; newPriority: "high" | "mid" | "low" }) => {
      const result = await updateAssignedPriority(checklistId, newPriority);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-checklists"] });
    },
  });
};

export function useCreateChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChecklistWithProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      queryClient.invalidateQueries({ queryKey: ["my-checklists"] });
    },
    onError: (error) => {
      console.error("Failed to create checklist:", error);
    },
  });
}

export function useDeleteUploadedChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUploadedChecklist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
  });
}