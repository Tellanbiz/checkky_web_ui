import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChecklistWithProgress } from "./client";

export function useCreateChecklist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createChecklistWithProgress,
        onSuccess: (data, variables) => {
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["checklists"] });
            queryClient.invalidateQueries({ queryKey: ["my-checklists"] });
        },
        onError: (error) => {
            console.error("Failed to create checklist:", error);
        },
    });
}
