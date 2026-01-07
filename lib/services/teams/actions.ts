'use server';

import { getAccessToken } from '@/lib/services/auth/auth-get';
import { inviteTeamMember, acceptTeamInvite, updateTeamMemberRole } from './post';
import { InviteParams, TeamInvite, TeamInviteInfo } from './data';
import { getMyTeamInvite, getTeamInviteInfo, getTeamInvites, getTeamMembers } from './get';

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


export async function getMyTeamInvitesAction(): Promise<TeamInviteInfo[]> {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('No access token found');
        }

        return await getMyTeamInvite(token);
    } catch (error) {
        console.error('Error inviting team member:', error);
        return []
    }
}


export async function getTeamInviteInfoAction(teamID: string): Promise<TeamInviteInfo | undefined> {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('No access token found');
        }

        return await getTeamInviteInfo(token, teamID);
    } catch (error) {
        console.error('Error inviting team member:', error);
        return
    }
}

export async function acceptTeamInviteAction(invite_id: string, accepted: boolean) {
    try {
        const token = await getAccessToken();
        const result = await acceptTeamInvite(token!, invite_id, accepted);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error accepting team invite:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to accept team invite'
        };
    }
}


export async function getTeamMembersAction() {
    try {
        const token = await getAccessToken();
        const result = await getTeamMembers(token!);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error accepting team invite:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to accept team invite'
        };
    }
}

export async function updateTeamMemberRoleAction(member_id: string | number, role: string) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('No access token found');
        }

        const result = await updateTeamMemberRole(token, member_id, role);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error updating team member role:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update team member role'
        };
    }
}


