"use server"

import { clientV1 } from "@/lib/client/client";
import { getAccessToken } from "../auth/auth-get";

export async function deleteGroup(id: string): Promise<boolean> {
    const token = await getAccessToken();
    const response = await clientV1.delete(`/checklist-groups/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.status === 200;
}
