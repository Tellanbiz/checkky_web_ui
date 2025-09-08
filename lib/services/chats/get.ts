import { clientV1 } from "@/lib/client/client";
import { ChatMessage, TeamGroup } from "./models";

export async function getChatGroups(token: string): Promise<TeamGroup[]> {
    const response = await clientV1.get<TeamGroup[]>('/chats', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}


export async function getChatMessages(token: string, teamID: string): Promise<ChatMessage[]> {
    const response = await clientV1.get<ChatMessage[]>(`/chats/${teamID}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}