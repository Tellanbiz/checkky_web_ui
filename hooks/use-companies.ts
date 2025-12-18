import { useQuery } from "@tanstack/react-query";
import { getAllCompanies } from "@/lib/services/company/actions";

export function useCompanies() {
    return useQuery({
        queryKey: ["companies"],
        queryFn: getAllCompanies,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
    });
}
