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

export async function downloadReport(
    token: string,
    params: {
        type: "overview" | "yearly" | "priority" | "completed-summary" | "member-performance" | "group-compliance" | "checklist-detail";
        format?: "pdf" | "html";
        year?: number;
        start_date?: string;
        end_date?: string;
        member_id?: string;
        assigned_checklist_id?: string;
    },
): Promise<{ data: ArrayBuffer; filename: string }> {
    const qs = new URLSearchParams({ type: params.type });
    qs.append("format", params.format ?? "pdf");
    if (params.year) qs.append("year", String(params.year));
    if (params.start_date) qs.append("start_date", params.start_date);
    if (params.end_date) qs.append("end_date", params.end_date);
    if (params.member_id) qs.append("member_id", params.member_id);
    if (params.assigned_checklist_id) qs.append("assigned_checklist_id", params.assigned_checklist_id);

    const response = await clientV1.get(`/report/download?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer",
    });

    const disposition = response.headers["content-disposition"] ?? "";
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? `report.${params.format ?? "pdf"}`;

    return { data: response.data, filename };
}