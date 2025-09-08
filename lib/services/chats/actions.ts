"use server";

import { cookies } from "next/headers";
import { getChatGroups, getChatMessages } from "./get";
import { createChatGroup, createChatMessage } from "./post";
import { CreateChatGroupParams, CreateChatMessageParams } from "./models";

export async function getAllChatGroups(): Promise<any[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("No access token found");
    }

    return await getChatGroups(token);
}


export async function createNewChatGroup(params: CreateChatGroupParams): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("No access token found");
    }

    return await createChatGroup(token, params);
}

export async function getMessagesForGroup(teamId: string): Promise<any[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("No access token found");
    }

    return await getChatMessages(token, teamId);
}

export async function sendChatMessage(params: CreateChatMessageParams): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("No access token found");
    }

    return await createChatMessage(token, params);
}
