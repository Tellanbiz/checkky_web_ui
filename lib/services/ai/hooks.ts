"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateAIChecklist, createChecklistFromAI } from "./client";

export function useGenerateAIChecklist() {
  return useMutation({
    mutationFn: generateAIChecklist,
    onError: (error) => {
      console.error("Failed to generate AI checklist:", error);
    },
  });
}

export function useCreateChecklistFromAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChecklistFromAI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      queryClient.invalidateQueries({ queryKey: ["my-checklists"] });
    },
    onError: (error) => {
      console.error("Failed to create checklist from AI:", error);
    },
  });
}
