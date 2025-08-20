'use server';

import { getAccessToken } from '@/lib/services/auth/auth-get';
import { inviteTeamMember, acceptTeamInvite } from './post';
import { InviteParams, TeamInvite } from './data';
import { getTeamInvites } from './get';

export async function inviteTeamMemberAction(params: InviteParams) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('No access token found');
        }

        const result = await inviteTeamMember(token, params);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error inviting team member:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to invite team member'
        };
    }
}


export async function getAllTeamInvites(): Promise<TeamInvite[]> {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('No access token found');
        }

        return await getTeamInvites(token);
    } catch (error) {
        console.error('Error inviting team member:', error);
        return []
    }
}

export async function acceptTeamInviteAction(teamId: string) {
    try {
        const token = await getAccessToken();
        console.log("token: ", token);

        if (!token) {
            throw new Error('No access token found');
        }

        const result = await acceptTeamInvite(token, teamId);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error accepting team invite:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to accept team invite'
        };
    }
}


