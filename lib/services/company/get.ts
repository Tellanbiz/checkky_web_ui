import { clientV1 } from "@/lib/client/client";
import { Company } from "./models";

export async function getCompanies(token: string): Promise<Company[]> {
    const response = await clientV1.get<Company[]>('/companies', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}