"use server"

import { clientV1 } from "@/lib/client/client";
import { Workflow, WorkspaceInfo, WorkflowParams, WorkflowMember } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function getWorkflows(title?: string, status?: string): Promise<Workflow[]> {
    const params = new URLSearchParams();
    if (title) params.append('title', title);
    if (status) params.append('status', status);

    const res = await clientV1.get<Workflow[]>(`/workflows${params.toString() ? `?${params.toString()}` : ''}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}



export async function getWorkflowById(id: string): Promise<WorkspaceInfo> {
    const res = await clientV1.get<WorkspaceInfo>(`/workflows/${id}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}

export async function getWorkflowMembers(id: string): Promise<WorkflowMember[]> {
    const res = await clientV1.get<WorkflowMember[]>(`/workflows/${id}/members`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}

