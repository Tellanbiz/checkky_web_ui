import { clientV1 } from "@/lib/client/client";
import { TeamInvite, TeamInviteInfo, TeamMember } from "./data";

export async function getTeamInvites(token: string): Promise<TeamInvite[]> {
    const response = await clientV1.get<TeamInvite[]>('/companies/team/invites', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}



export async function getTeamInviteInfo(token: string, team_id: string): Promise<TeamInviteInfo> {
    const response = await clientV1.get<TeamInviteInfo>(`/companies/team/invites/info?team_id=${team_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}



export async function getMyTeamInvite(token: string): Promise<TeamInviteInfo[]> {
    const response = await clientV1.get<TeamInviteInfo[]>(`/companies/team/invites/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}


export async function getTeamMembers(token: string): Promise<TeamMember[]> {
    const response = await clientV1.get<TeamMember[]>(`/companies/team/members`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

