'use server';

import { clientV1 } from "@/lib/client/client";
import { WorkflowParams } from "./models";
import { getAccessToken } from "../auth/auth-get";


export async function createWorkflow(params: WorkflowParams): Promise<WorkflowParams> {
    const response = await clientV1.post<WorkflowParams>('/workflows', params, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
} 	


export async function updateWorkflow(workflowId: String, params: WorkflowParams): Promise<boolean> {
    const response = await clientV1.put(`/workflows/${workflowId}`, params, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.status == 200;
} 	

export async function deleteWorkflow(workflowId: String): Promise<void> {
    const response = await clientV1.delete<void>(`/workflows/${workflowId}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
} 	

