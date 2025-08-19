'use server';

import { cookies } from 'next/headers';
import { getAccessToken } from '@/lib/services/auth/auth-get';
import { inviteTeamMember, acceptTeamInvite, updateTeamMemberRole } from './post';

export async function inviteTeamMemberAction(params: { email: string; role: string; message?: string }) {
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

export async function acceptTeamInviteAction(teamId: string) {
    try {
        const token = await getAccessToken();
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

export async function updateTeamMemberRoleAction(memberId: number, role: string) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('No access token found');
        }

        const result = await updateTeamMemberRole(token, memberId, role);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error updating team member role:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update team member role'
        };
    }
}
