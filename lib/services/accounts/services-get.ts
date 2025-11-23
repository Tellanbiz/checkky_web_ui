"use server"
import { clientV1 } from "@/lib/client/client";
import { Account, Farm } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function getAccount(): Promise<Account> {
    const res = await clientV1.get("/account/my", {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    const r: Account = res.data as Account;
    return r
}

export async function getFarms(token: string): Promise<Farm[]> {
    const res = await clientV1.get("/farms", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const farms: Farm[] = res.data as Farm[];
    return farms
}