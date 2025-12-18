import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompanyAction } from "@/lib/services/company/actions";
import type { CompanyParams } from "@/lib/services/company/models";

export function useCreateCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (companyData: CompanyParams) => createCompanyAction(companyData),
        onSuccess: () => {
            // Invalidate and refetch companies list
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
        onError: (error) => {
            console.error("Failed to create company:", error);
        },
    });
}
