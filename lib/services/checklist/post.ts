"use server"

import { clientV1 } from "@/lib/client/client";
import { AssignedChecklistParams } from "./models";
import { getAccessToken } from "../auth/auth-get";

export interface CreateChecklistData {
    name: string;
    description: string;
    checklist: File;
    isPublic?: boolean;
}

export async function createChecklist(data: CreateChecklistData): Promise<any> {
    // Validate required fields
    if (!data.name || !data.checklist) {
        throw new Error('Name and checklist file are required');
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('checklist', data.checklist);
    
    // Only append isPublic if it's explicitly true to avoid breaking existing API
    if (data.isPublic === true) {
        formData.append('public', 'true');
    }

    const res = await clientV1.postForm('/checklist/upload', formData, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    
    return res.status != 200 ? { error: res.data.error } : res.data;
}

export async function assignChecklist(data: AssignedChecklistParams): Promise<any> {
    const res = await clientV1.post('/checklist/assign', data, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.status != 200 ? { error: res.data.error } : res.data;
}

export async function updateAssignedPriority(id: string, priority: "low" | "mid" | "high"): Promise<any> {
    const res = await clientV1.post('/checklist/assign/priority', { id, priority }, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.status != 200 ? { error: res.data.error } : res.data;
}



export async function deleteAssignedChecklist(id: string): Promise<any> {
    const res = await clientV1.delete(`/checklist/assign/${id}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.status != 200 ? { error: res.data.error } : res.data;
}
