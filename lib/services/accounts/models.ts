export interface PendingEmailChange {
    id: string;
    new_email: string;
    requested_at: string;
    expires_at: string;
}

export interface Account {
    id: string;
    picture: string;
    full_name: string;
    email: string;
    current_company_id: string;
    onboarding_required: boolean;
    pending_email_change?: PendingEmailChange | null;
}

export interface UpdateProfileParams {
    full_name: string;
    picture?: string;
}

export interface RequestEmailChangeParams {
    email: string;
}

export interface VerifyEmailChangeParams {
    code: string;
}

export interface OnboardingProfile {
    org_name: string;
    country: string;
    location: string;
    team_members: string;
    industry: string;
    position: string;
    operation_type: string[];
    custom_operation_types: string[];
    equipment_used: string[];
    facilities: string[];
    crops_or_products: string[];
    operation_scale: string;
    pain_points: string[];
    compliance_requirements: string[];
    documentation_gaps: string[];
    incident_history: string;
    total_staff: string;
    staff_roles: string[];
    who_completes_checklists: string[];
    shift_structure: string;
    devices_used: string[];
    connectivity: string;
    existing_tools: string;
    integrations_needed: string[];
    photo_required: string;
    top_priority: string;
    timeline: string;
    budget: string;
    success_metrics: string;
    custom_categories: string[];
    custom_field_types: string[];
    custom_compliance_standards: string[];
    custom_checklist_names: string[];
    additional_notes: string;
    contact_name: string;
    contact_role: string;
    contact_email: string;
    contact_phone: string;
    onboarding_completed: boolean;
}

export interface SaveOnboardingParams extends Omit<OnboardingProfile, "onboarding_completed"> {
    complete?: boolean;
}

export interface Farm {
    id: string;
    name: string;
    location: string;
    country: string;
    size_ha: number;
    points: [number, number]; // [longitude, latitude]
    owner: Owner;
}



export interface Owner {
    id: string;
    full_name: string;
    email: string;
    farm?: {
        id: string;
        name: string;
    }
}
