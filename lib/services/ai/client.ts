"use server";

import { clientV1 } from "@/lib/client/client";
import type {
  GenerateAIChecklistData,
  GenerateAIChecklistResponse,
  CreateChecklistFromAIData,
  CreateChecklistFromAIResponse,
} from "./types";
import { getAccessToken } from "../auth/auth-get";

export async function generateAIChecklist(
  data: GenerateAIChecklistData
): Promise<GenerateAIChecklistResponse> {
  console.log("generating checklist");

  const res = await clientV1.post("/checklist/ai/generate", data, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    timeout: 30000,
  });

  if (res.status !== 200) {
    throw new Error(res.data?.error ?? "Failed to generate AI checklist");
  }

  return res.data;
}

export async function createChecklistFromAI(
  data: CreateChecklistFromAIData
): Promise<CreateChecklistFromAIResponse> {
  const res = await clientV1.post("/checklist/ai/create", data, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    timeout: 30000,
  });

  if (res.status !== 200) {
    throw new Error(res.data?.error ?? "Failed to create checklist from AI");
  }

  return res.data;
}
