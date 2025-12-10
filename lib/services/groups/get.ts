"use server"

import { clientV1 } from "@/lib/client/client";
import { Group } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function getGroups(): Promise<Group[]> {
    const token = await getAccessToken();
    const response = await clientV1.get<{ message: string; data: Group[] }>('/checklist-groups', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });


    return response.data.data;
}

export async function getGroupById(id: string): Promise<Group> {
    const token = await getAccessToken();
    const response = await clientV1.get<{ message: string; data: Group }>(`/checklist-groups/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}
