"use server"

import { clientV1 } from "@/lib/client/client";
import { AssignedChecklist, CheckList, ChecklistInfo, PublicChecklist } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function getChecklists(name?: string): Promise<CheckList[]> {
    const res = await clientV1.get<CheckList[]>(`/checklists?name=${name ?? "none"}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}

export async function getPublicChecklists(name?: string, skip?: number, category?: string): Promise<PublicChecklist[]> {
    const qs = new URLSearchParams({
        name: name ?? "none",
        skip: String(skip ?? 0),
        category: category ?? "none",
    });
    const res = await clientV1.get<PublicChecklist[]>(`/checklists/public?${qs.toString()}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}

export async function getChecklistInfo(id?: string): Promise<ChecklistInfo> {
    const res = await clientV1.get<ChecklistInfo>(`/checklist/info?id=${id}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}

export async function getAssignedChecklists(): Promise<AssignedChecklist[]> {
    const res = await clientV1.get<AssignedChecklist[]>(`/checklists/assigned`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return res.data
}