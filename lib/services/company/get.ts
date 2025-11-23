import { clientV1 } from "@/lib/client/client";
import { Company, CompanyWithStats } from "./models";

export async function getCompanies(token: string): Promise<Company[]> {
    const response = await clientV1.get<Company[]>('/companies', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function getCompaniesWithStats(token: string): Promise<CompanyWithStats[]> {
    const response = await clientV1.get<CompanyWithStats[]>('/companies/with-stats', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}