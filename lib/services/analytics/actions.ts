"use server"

import { clientV1 } from "../../client/client";
import { getAccessToken } from "../auth/auth-get";

export interface AnalyticsData {
    completion_rate: number;
    avg_response_time: number;
    total_checklists: number;
    active_tasks: number;
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
}

export async function getAnalyticsData(params?: AnalyticsParams): Promise<AnalyticsData> {
    const searchParams = new URLSearchParams();

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

export async function exportAnalyticsData(format: "json" | "csv" = "json", params?: AnalyticsParams): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append("format", format);

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

    if (format === "csv") {
        // Handle CSV download
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return response.data;
    }

    return response.data;
}
