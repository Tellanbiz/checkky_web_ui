'use server';

import { clientV1 } from "@/lib/client/client";
import { Section } from "./models";

import type { SectionParams } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function submitFarm(params: SectionParams): Promise<Section> {
  const response = await clientV1.post<Section>('/sections', {
    id: params.id,
    name: params.name,
    location: params.location,
    size_ha: params.size_ha,
    points: params.points,
    active: params.active,
  }, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  return response.data;
} 	