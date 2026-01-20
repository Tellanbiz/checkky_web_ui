export interface GroupParams {
    name: string
    description: string
    parent_group_id?: number
}

export interface Group {
    id: string
    name: string
    description: string
    createdAt: string
    no_of_checklists: number
    parent_group_id?: string | null
    company_id: string
}

export interface CreateGroupResponse {
    message: string
    data: Group
}
