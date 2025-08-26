"use server"

import { cookies } from "next/headers";
import { submitFarm } from "./services-post";
import { getSections } from "./service-get";
import { FarmParams } from "./models";

export async function submitSection(params: FarmParams): Promise<any> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return submitFarm(token, params);
}

export async function getAllSections(): Promise<any> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return getSections(token);
}
