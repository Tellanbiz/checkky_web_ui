import { clientV1 } from "@/lib/client/client";
import { CompanyParams } from "./models";

export async function createCompany(token: string, company: CompanyParams): Promise<boolean> {
    const response = await clientV1.post('/companies', company, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.status != 200;
}

export async function updateCurrentCompany(token: string, current_company_id: string): Promise<boolean> {
    const response = await clientV1.put('/companies', { current_company_id }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.status != 200;
}