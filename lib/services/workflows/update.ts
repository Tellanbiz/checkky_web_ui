'use server';

import { clientV1 } from "@/lib/client/client";
import { WorkflowParams } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function updateWorkflow(id: string, params: WorkflowParams): Promise<WorkflowParams> {
    console.log(`Updating workflow ${id}:`, params);

    const response = await clientV1.put<WorkflowParams>(`/workflows/${id}`, params, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
}
