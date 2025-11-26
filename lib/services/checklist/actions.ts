"use server";

import { cookies } from "next/headers";
import { assignChecklist as assignChecklistService, createChecklist as createChecklistService, CreateChecklistData } from "./post";
import { getAssignedChecklists, getChecklistInfo, getChecklists } from "./services-get";
import { AssignedChecklistParams } from "./models";

export async function createChecklist(data: CreateChecklistData): Promise<any> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    return createChecklistService(token, data);
}

export async function getAllChecklists(name?: string): Promise<any> {

    return getChecklists( name);
}

export async function getAssignedChecklistsAction(): Promise<any> {
    try {
        const data = await getAssignedChecklists();
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching assigned checklists:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch assigned checklists'
        };
    }
}

export async function getChecklistsInfo(id: string): Promise<any> {
    return getChecklistInfo( id);
}

export async function assignChecklist(data: AssignedChecklistParams): Promise<any> {
const result = await assignChecklistService(data);
        return { success: true, data: result };
}