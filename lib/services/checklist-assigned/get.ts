"use server"

import { clientV1 } from "@/lib/client/client";
import { AssignedChecklistWithAnswer } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function getAssignedCheclistWithAnswer(id: string): Promise<AssignedChecklistWithAnswer> {
    const response = await clientV1.get<AssignedChecklistWithAnswer>(`checklist/info/answers?id=${id}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
}
