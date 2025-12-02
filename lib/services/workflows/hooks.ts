"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckList } from "@/lib/services/checklist/models";
import { getChecklists } from "@/lib/services/checklist/get";

export function useAvailableChecklistsForWorkflows(name?: string) {
  return useQuery<CheckList[]>({
    queryKey: ["workflows", "available-checklists", name],
    queryFn: async () => {
      return getChecklists(name);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
