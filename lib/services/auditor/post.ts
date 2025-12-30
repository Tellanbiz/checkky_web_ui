"use server"

import { clientV1 } from "@/lib/client/client";
import { AssignAuditorBody, ScoreParams } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function assignAuditor(params: AssignAuditorBody): Promise<boolean> {
  const response = await clientV1.post('/audits/assign', params, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  return response.status == 200;
} 	

export async function score(params: ScoreParams): Promise<boolean> {
  const response = await clientV1.post('/audits/score', params, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  return response.status == 200;
} 	



export async function completeAudit(assignedChecklistId: string): Promise<boolean> {
  const response = await clientV1.post('/audits/complete', {"assigned_checklist_id": assignedChecklistId}, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  return response.status == 200;
} 	
