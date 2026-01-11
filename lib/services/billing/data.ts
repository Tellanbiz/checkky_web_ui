export type BillingPlan = {
    id: string;
    stripe_id: string;
    price: number;
    no_of_checklist: number;
    no_of_members: number;
    no_of_companies: number;
};

export type AvailablePlansResponse = {
    plans: BillingPlan[];
};

export type CheckoutBody = {
    price_id: string;
    quantity?: number;
    success_url: string;
    cancel_url: string;
};

export type CheckoutResponse = {
    id: string;
    url: string;
};

export type PortalBody = {
    return_url: string;
};

export type PortalResponse = {
    url: string;
};

export type CancelBody = {
    subscription_id: string;
    cancel_at_period_end?: boolean;
    cancel_immediately?: boolean;
};