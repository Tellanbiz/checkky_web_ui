"use server";

import { clientV1 } from "@/lib/client/client";
import { getAccessToken } from "../auth/auth-get";
import type { CancelBody, CheckoutBody, CheckoutResponse, PortalBody, PortalResponse } from "./data";

async function authHeader() {
    const token = await getAccessToken();
    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function createCheckoutSession(body: CheckoutBody): Promise<CheckoutResponse> {
    const res = await clientV1.post<CheckoutResponse>(`/billing/checkout`, body, {
        headers: await authHeader(),
    });
    return res.data;
}

export async function createPortalSession(body: PortalBody): Promise<PortalResponse> {
    const res = await clientV1.post<PortalResponse>(`/billing/portal`, body, {
        headers: await authHeader(),
    });
    return res.data;
}

export async function cancelSubscription(body: CancelBody): Promise<any> {
    const res = await clientV1.post<any>(`/billing/cancel`, body, {
        headers: await authHeader(),
    });
    return res.data;
}