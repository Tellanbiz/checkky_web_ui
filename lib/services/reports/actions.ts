"use server";

import { cookies } from "next/headers";
import { getYearlyReport, getMonthlyReport } from "./get";
import { MonthlyReport, MonthlyTasks } from "./models";

export async function getYearlyReportAction(): Promise<any> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            throw new Error("Not authenticated");
        }

        const data = await getYearlyReport(token);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching yearly report:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch yearly report'
        };
    }
}

export async function getMonthlyReportAction(): Promise<any> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            throw new Error("Not authenticated");
        }

        const result = await getMonthlyReport(token);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching monthly report:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch monthly report'
        };
    }
}
