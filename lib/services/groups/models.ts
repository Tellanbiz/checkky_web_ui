export interface GroupParams {
    name: string
    description: string
}

export interface Group {
    id: string
    name: string
    description: string
    createdAt: string
    no_of_checklists: number
    company_id: string
}

export interface CreateGroupResponse {
    message: string
    data: Group
}
