import { clientV1 } from "@/lib/client/client";
import { Farm } from "./models";

export async function getFarms(token: string): Promise<Farm[]> {
    const response = await clientV1.get<Farm[]>('/farms', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}