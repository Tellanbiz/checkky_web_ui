"use server";

import { cookies } from "next/headers";
import { getYearlyReport, getMonthlyReport, getOverviewReport } from "./get";
import { MonthlyReport, MonthlyTasks } from "./models";

export async function getOverviewReportAction(member_id?: string): Promise<any> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            throw new Error("Not authenticated");
        }

        const data = await getOverviewReport(token, member_id);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching overview report:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch overview report'
        };
    }
}

export async function getYearlyReportAction(member_id?: string, year?: number): Promise<any> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            throw new Error("Not authenticated");
        }

        const data = await getYearlyReport(token, year, member_id);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching yearly report:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch yearly report'
        };
    }
}

export async function getMonthlyReportAction(member_id?: string, params?: { start_date?: string; end_date?: string }): Promise<any> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            throw new Error("Not authenticated");
        }

        const result = await getMonthlyReport(token, { ...params, member_id });
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching monthly report:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch monthly report'
        };
    }
}
