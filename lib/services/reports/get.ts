import { clientV1 } from "@/lib/client/client";
import { MonthlyReport, MonthlyTasks, OverviewReport } from "./models";

export async function getYearlyReport(token: string, year?: number, member_id?: string): Promise<MonthlyTasks> {
    const qs = new URLSearchParams({
        year: String(year ?? new Date().getFullYear()),
    });
    if (member_id) qs.append("member_id", member_id);
    const response = await clientV1.get<MonthlyTasks>(`/report/yearly?${qs.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function getOverviewReport(token: string, member_id?: string): Promise<OverviewReport> {
    const qs = new URLSearchParams();
    if (member_id) qs.append("member_id", member_id);
    const response = await clientV1.get<OverviewReport>(`/report/overview?${qs.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function getMonthlyReport(token: string, params?: { start_date?: string; end_date?: string; member_id?: string }): Promise<MonthlyReport> {
    const qs = new URLSearchParams();
    if (params?.start_date) qs.append("start_date", params.start_date);
    if (params?.end_date) qs.append("end_date", params.end_date);
    if (params?.member_id) qs.append("member_id", params.member_id);

    const response = await clientV1.get<MonthlyReport>(`/report/monthly?${qs.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}