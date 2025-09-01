import { clientV1 } from "@/lib/client/client";
import { AssignedChecklistParams } from "./models";

export interface CreateChecklistData {
    name: string;
    description: string;
    checklist: File;
}

export async function createChecklist(token: string, data: CreateChecklistData): Promise<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('checklist', data.checklist);

    const res = await clientV1.postForm('/checklist/upload', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.status != 200 ? { error: res.data.error } : res.data;
}

export async function assignChecklist(token: string, data: AssignedChecklistParams): Promise<any> {
    const res = await clientV1.post('/checklist/assign', data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.status != 200 ? { error: res.data.error } : res.data;
}