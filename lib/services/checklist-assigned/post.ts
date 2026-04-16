"use server";

import { clientV1 } from "@/lib/client/client";
import { getAccessToken } from "../auth/auth-get";

export interface SubmitChecklistAnswerData {
  assigned_checklist_id: string;
  checklist_item_id: number;
  answer: string;
  photo_url?: string;
}

export async function submitChecklistAnswer(data: SubmitChecklistAnswerData): Promise<any> {
  const response = await clientV1.post("/checklist/answer", data, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });

  return response.status !== 200 ? { error: response.data.error } : response.data;
}
