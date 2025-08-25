'use server';

import { clientV1 } from "@/lib/client/client";
import { Farm } from "./models";


export async function submitFarm(token: string, formData: FormData): Promise<Farm> {
  const response = await clientV1.post<Farm>('/farms', {
    name: formData.get('name'),
    location: formData.get('location'),
    size_ha: Number(formData.get('size')),
    points: formData.get('points'),
    active: formData.get('active'),
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
} 	