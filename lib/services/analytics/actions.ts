"use server"

import { clientV1 } from "../../client/client";
import { getAccessToken } from "../auth/auth-get";

export interface AnalyticsData {
    completion_rate: number;
    total_checklists: number;
    assigned_checklists: number;
    completed_checklists: number;
    pending_checklists: number;
    total_members: number;
    performance_data: MonthlyPerformance[];
    category_data: CategoryDistribution[];
    team_performance: TeamMemberStats[];
}

export interface MonthlyPerformance {
    month: string;
    completed: number;
    pending: number;
    overdue: number;
}

export interface CategoryDistribution {
    name: string;
    value: number;
    color: string;
}

export interface TeamMemberStats {
    name: string;
    completed: number;
    quality: number;
    efficiency: number;
}

export interface AnalyticsParams {
    start_date?: string;
    end_date?: string;
    scope?: "team" | "me";
}

export async function getAnalyticsData(params?: AnalyticsParams): Promise<AnalyticsData> {
    const searchParams = new URLSearchParams();

    if (params?.scope) {
        searchParams.append("scope", params.scope);
    }

    if (params?.start_date) {
        searchParams.append("start_date", params.start_date);
    }

    if (params?.end_date) {
        searchParams.append("end_date", params.end_date);
    }

    const response = await clientV1.get(`/analytics?${searchParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });
    return response.data;
}

export async function exportAnalyticsData(format: "json" | "csv" = "json", params?: AnalyticsParams): Promise<{ data: string; filename: string; contentType: string }> {
    const searchParams = new URLSearchParams();
    searchParams.append("format", format);

    if (params?.scope) {
        searchParams.append("scope", params.scope);
    }

    if (params?.start_date) {
        searchParams.append("start_date", params.start_date);
    }

    if (params?.end_date) {
        searchParams.append("end_date", params.end_date);
    }

    const response = await clientV1.get(`/analytics/export?${searchParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    });

    const contentType = format === "csv" ? "text/csv" : "application/json";
    const raw = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    const filename = `analytics-${new Date().toISOString().split("T")[0]}.${format}`;

    return { data: raw, filename, contentType };
}
