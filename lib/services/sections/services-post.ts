'use server';

import { clientV1 } from "@/lib/client/client";
import { Farm } from "./models";

import type { FarmParams } from "./models";

export async function submitFarm(token: string, params: FarmParams): Promise<Farm> {
  const response = await clientV1.post<Farm>('/sections', {
    name: params.name,
    location: params.location,
    size_ha: params.size_ha,
    points: params.points,
    active: params.active,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
} 	