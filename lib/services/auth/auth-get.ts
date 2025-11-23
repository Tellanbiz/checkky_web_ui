"use server";

import { cookies } from "next/headers";
import { getAccount as getAccountByToken } from "@/lib/services/accounts/services-get";
import type { Account } from "@/lib/services/accounts/models";

export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value || null;
}

export async function getAccount(): Promise<Account> {

    return getAccountByToken();
}

