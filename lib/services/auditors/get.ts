"use server"

import { clientV1 } from "@/lib/client/client";
import { getAccessToken } from "../auth/auth-get";
import { GetAuditorsRow, GetOngoingAuditsRow, GetCompleteAuditsRow } from "./data";

export async function getAuditors(): Promise<GetAuditorsRow[]> {
    const response = await clientV1.get<GetAuditorsRow[]>("/audits/auditors", {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
}

export async function getOngoingAudits(): Promise<GetOngoingAuditsRow[]> {
    const response = await clientV1.get<GetOngoingAuditsRow[]>("/audits/ongoing", {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
}

export async function getCompleteAudits(): Promise<GetCompleteAuditsRow[]> {
    const response = await clientV1.get<GetCompleteAuditsRow[]>("/audits/complete", {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
}
