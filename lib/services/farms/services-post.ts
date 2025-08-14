'use server';

import { clientV1 } from "@/lib/client/client";


export interface Farm {
  id: string;
  name: string;
  location: string;
  size_ha: number;
  status: string;
}

export async function getFarms(): Promise<Farm[]> {
  const response = await clientV1.get<Farm[]>('/farms');
  return response.data;
}

export async function submitFarm(formData: FormData): Promise<Farm> {
  const response = await clientV1.post<Farm>('farms', {
    name: formData.get('name'),
    location: formData.get('location'),
    country: formData.get('country'),
    size_ha: Number(formData.get('size')),
  });
  return response.data;
} 