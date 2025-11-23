"use server";

import { cookies } from "next/headers";
import { getCompanies, getCompaniesWithStats } from "./get";
import { createCompany as createCompanyPost, updateCurrentCompany as updateCurrentCompanyPost } from "./post";
import type { Company, CompanyWithStats, CompanyParams } from "./models";

export async function getAllCompanies(): Promise<Company[]> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) {
            throw new Error("Not authenticated");
        }
        return await getCompanies(token);
    } catch (error) {
        console.error("Failed to get companies:", error);
        return [];
    }
}

export async function getAllCompaniesWithStats(): Promise<CompanyWithStats[]> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) {
            throw new Error("Not authenticated");
        }
        return await getCompaniesWithStats(token);
    } catch (error) {
        console.error("Failed to get companies with stats:", error);
        return [];
    }
}

export async function createCompanyAction(company: CompanyParams): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) {
            throw new Error("Not authenticated");
        }
        const success = await createCompanyPost(token, company);
        console.log("company created", success);

        return success;
    } catch (error) {
        console.error("Failed to create company:", error);
        return false;
    }
}

export async function updateCurrentCompanyAction(current_company_id: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) {
            throw new Error("Not authenticated");
        }
        const failed = await updateCurrentCompanyPost(token, current_company_id);
        return failed;
    } catch (error) {
        console.error("Failed to update current company:", error);
        return false;
    }
}
