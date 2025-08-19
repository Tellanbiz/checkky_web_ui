'use server';

import { clientV1 } from "@/lib/client/client";
import { Result } from "@/lib/shared/data";

interface InviteParams {
    email: string;
    role: string;
    message?: string;
}

export async function inviteTeamMember(token: string, params: InviteParams): Promise<Result> {
    const response = await clientV1.post<Result>('/companies/team/invite', params, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function acceptTeamInvite(token: string, team_id: string): Promise<Result> {
    const response = await clientV1.post<Result>('/companies/team/accept', { team_id }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function updateTeamMemberRole(token: string, memberId: number, role: string): Promise<Result> {
    const response = await clientV1.put<Result>(`/companies/team/members/${memberId}/role`, { role }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
} 