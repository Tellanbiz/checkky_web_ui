import { clientV1 } from "@/lib/client/client";
import { CheckList, ChecklistInfo } from "./models";

export async function getChecklists(token: string, name?: string): Promise<CheckList[]> {
    const res = await clientV1.get(`/checklists?name=${name ?? "none"}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const farms: CheckList[] = res.data as CheckList[];
    return farms
}

export async function getChecklistInfo(token: string, id?: string): Promise<ChecklistInfo> {
    const res = await clientV1.get(`/checklist/info?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const info: ChecklistInfo = res.data as ChecklistInfo;
    return info
}