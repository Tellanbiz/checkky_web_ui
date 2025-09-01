import { clientV1 } from "@/lib/client/client";
import { AssignedChecklist, CheckList, ChecklistInfo } from "./models";

export async function getChecklists(token: string, name?: string): Promise<CheckList[]> {
    const res = await clientV1.get<CheckList[]>(`/checklists?name=${name ?? "none"}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data
}

export async function getChecklistInfo(token: string, id?: string): Promise<ChecklistInfo> {
    const res = await clientV1.get<ChecklistInfo>(`/checklist/info?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data
}

export async function getAssignedChecklists(token: string) {
    const res = await clientV1.get<AssignedChecklist[]>(`/checklists/assigned`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data
}