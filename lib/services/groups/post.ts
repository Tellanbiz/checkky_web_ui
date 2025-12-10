"use server"

import { clientV1 } from "@/lib/client/client";
import { GroupParams, Group, CreateGroupResponse } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function createGroup(group: GroupParams): Promise<Group> {
    const token = await getAccessToken();
    const response = await clientV1.post<CreateGroupResponse>('/checklist-groups', group, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

export async function updateGroup(id: string, group: GroupParams): Promise<Group> {
    const token = await getAccessToken();
    const response = await clientV1.put<{ message: string; data: Group }>(`/checklist-groups/${id}`, group, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}
