"use server";

import { cookies } from "next/headers";
import { getAccount as getAccountByToken } from "@/lib/services/accounts/services-get";
import type { Account } from "@/lib/services/accounts/models";

export async function getClientAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value || null;
}

export async function getClientAccount(): Promise<Account | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return null;
        }

        return await getAccountByToken(token);
    } catch (error) {
        console.error("Failed to get client account:", error);
        return null;
    }
}
