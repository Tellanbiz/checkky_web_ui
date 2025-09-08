import { clientV1 } from "@/lib/client/client";
import { CreateChatGroupParams, CreateChatMessageParams } from "./models";

export async function createChatGroup(token: string, params: CreateChatGroupParams): Promise<boolean> {
    const response = await clientV1.post('/chats/new', params, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.status === 200;
}


export async function createChatMessage(token: string, params: CreateChatMessageParams): Promise<boolean> {
    const response = await clientV1.post('/chats/message', params, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.status === 200;
}