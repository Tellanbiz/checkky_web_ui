"use server"

import { clientV1 } from "@/lib/client/client";
import { getAccessToken } from "../auth/auth-get";

export interface CreateChecklistData {
    name: string;
    description: string;
    category: string;
    checklist_group_id?: string;
    checklist: File;
    isPublic?: boolean;
}

export async function createChecklistWithProgress(
    data: CreateChecklistData
): Promise<any> {
    // Validate required fields
    if (!data.name || !data.checklist || !data.category) {
        throw new Error('Name, category, and checklist file are required');
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('category', data.category);
    formData.append('checklist', data.checklist);

    // Only append checklist_group_id if it exists
    if (data.checklist_group_id) {
        formData.append('checklist_group_id', data.checklist_group_id);
    }

    // Only append isPublic if it's explicitly true to avoid breaking existing API
    if (data.isPublic === true) {
        formData.append('public', 'true');
    }

    // Get auth token
    const token = await getAccessToken();

    const response = await clientV1.post('/checklist/upload', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    const result = response.status !== 200 ? { error: response.data.error } : response.data;

    // Return progress information along with the result
    return {
        ...result,
        progress: 100, // Upload complete
        status: "Complete"
    };
}
