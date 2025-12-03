"use server"

import { clientV1 } from "@/lib/client/client";
import { Section } from "./models";
import { getAccessToken } from "../auth/auth-get";

export async function getSections(): Promise<Section[]> {
    const response = await clientV1.get<Section[]>('/sections', {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
}


export async function getSectionInfo( sectionID: string): Promise<Section[]> {
    const response = await clientV1.get<Section[]>(`/sections/info?=${sectionID}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
}