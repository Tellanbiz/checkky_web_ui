export interface CompanyParams {
    name: string
}

export interface Company {
    id: string
    name: string
    created_at: string
}

export interface CompanyWithStats extends Company {
    member_count: number
    checklist_count: number
    status: string
    plan: string
}