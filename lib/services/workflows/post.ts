'use server';

import { clientV1 } from "@/lib/client/client";
import { WorkflowParams } from "./models";
import { getAccessToken } from "../auth/auth-get";


export async function createWorkflow(params: WorkflowParams): Promise<WorkflowParams> {
    console.log(params);

    const response = await clientV1.post<WorkflowParams>('/workflows', params, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
} 	