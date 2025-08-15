"use server"

import { cookies } from "next/headers";
import { submitFarm } from "./services-post";
import { getFarms } from "./service-get";

export async function createFarm(formData: FormData): Promise<any> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return submitFarm(token, formData);
}

export async function getAllFarms(): Promise<any> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return getFarms(token);
}
