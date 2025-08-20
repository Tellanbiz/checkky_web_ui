import { clientV1 } from "@/lib/client/client";
import { TeamInvite } from "./data";

export async function getTeamInvites(token: string): Promise<TeamInvite[]> {
    const response = await clientV1.get<TeamInvite[]>('/companies/team/invites', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

