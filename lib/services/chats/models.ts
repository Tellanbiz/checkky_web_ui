/**
 * Parameters for creating a new chat group
 */
export interface CreateChatGroupParams {
    name: string;
    description: string;
}

/**
 * Chat group data structure
 */
export interface TeamGroup {
    id: string;
    name: string;
    description: string;
    company_id: string;
    created_at: string; // ISO date string
    member_count: number;
    created_by_user: {
        id: string;
        name: string;
    };
}


export interface ChatMessage {
    id: string;
    message: string;
    team_id: string;
    sender: {
        id: string;
        full_name: string;
        is_mine: boolean;
    };
}


export interface CreateChatMessageParams {
    message: string;
    team_id: string;
}