import { clientV1 } from "@/lib/client/client";
import { MonthlyReport, MonthlyTasks } from "./models";

export async function getYearlyReport(token: string): Promise<MonthlyTasks> {
    const response = await clientV1.get<MonthlyTasks>(`/report/yearly?year=2025`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function getMonthlyReport(token: string): Promise<MonthlyReport> {
    const response = await clientV1.get<MonthlyReport>(`/report/monthly`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}