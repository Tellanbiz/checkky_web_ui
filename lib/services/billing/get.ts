"use server";

import { clientV1 } from "@/lib/client/client";
import { getAccessToken } from "../auth/auth-get";
import type { AvailablePlansResponse } from "./data";

async function authHeader() {
    const token = await getAccessToken();
    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function getAvailablePlans(): Promise<AvailablePlansResponse> {
    const res = await clientV1.get<AvailablePlansResponse>(`/billing/plans`, {
        headers: await authHeader(),
    });
    return res.data;
}

export async function getCurrentSubscription(): Promise<any> {
    const res = await clientV1.get<any>(`/billing/subscription`, {
        headers: await authHeader(),
    });
    return res.data;
}

export async function getInvoices(): Promise<any> {
    const res = await clientV1.get<any>(`/billing/invoices`, {
        headers: await authHeader(),
    });
    return res.data;
}