"use server";

import { cookies } from "next/headers";
import { createChecklist as createChecklistService, CreateChecklistData } from "./service-post";
import { getChecklistInfo, getChecklists } from "./services-get";

export async function createChecklist(data: CreateChecklistData): Promise<any> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return createChecklistService(token, data);
}

export async function getAllChecklists(name?: string): Promise<any> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return getChecklists(token, name);
}

export async function getChecklistsInfo(id: string): Promise<any> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return getChecklistInfo(token, id);
}