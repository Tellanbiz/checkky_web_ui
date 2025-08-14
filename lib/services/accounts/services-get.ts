import { clientV1 } from "@/lib/client/client";
import { Account, Farm } from "./models";

export async function getAccount(token: string): Promise<Account> {
    const res = await clientV1.get("/account/my", {
        headers: {
            Authorization: `Bearer ${token}`,
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