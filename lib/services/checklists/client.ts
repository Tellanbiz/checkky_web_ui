"use client"

import axios from "axios";

export interface CreateChecklistData {
    name: string;
    description: string;
    category: string;
    checklist_group_id?: string;
    checklist: File;
    isPublic?: boolean;
    onProgress?: (progress: number) => void;
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

    const response = await axios.post("/api/checklists/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            const total = progressEvent.total ?? data.checklist.size;
            if (!total) return;

            const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
            data.onProgress?.(Math.min(100, Math.max(0, percentCompleted)));
        },
    });

    return response.data;
}
