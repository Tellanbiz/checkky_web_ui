"use server"

import { clientV1 } from "@/lib/client/client";
import { Workflow, WorkflowDetail, WorkflowParams, WorkflowMember } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function getWorkflows(status?: string): Promise<Workflow[]> {
    const res = await clientV1.get<Workflow[]>(`/workflows${status ? `?status=${status}` : ''}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}

export async function getAllWorkflows(): Promise<Workflow[]> {
    const res = await clientV1.get<Workflow[]>(`/workflows/all`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}

export async function getWorkflowById(id: string): Promise<WorkflowDetail> {
    const res = await clientV1.get<WorkflowDetail>(`/workflows/${id}`, {
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

export async function searchWorkflows(params: {
    title?: string;
    priority?: string;
    status?: string;
}): Promise<Workflow[]> {
    const searchParams = new URLSearchParams();
    if (params.title) searchParams.append('title', params.title);
    if (params.priority) searchParams.append('priority', params.priority);
    if (params.status) searchParams.append('status', params.status);

    const res = await clientV1.get<Workflow[]>(`/workflows/search?${searchParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}
