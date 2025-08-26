import { clientV1 } from "@/lib/client/client";
import { Farm } from "./models";

export async function getSections(token: string): Promise<Farm[]> {
    const response = await clientV1.get<Farm[]>('/sections', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}


export async function getSectionInfo(token: string, sectionID: string): Promise<Farm[]> {
    const response = await clientV1.get<Farm[]>(`/sections/info?=${sectionID}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}