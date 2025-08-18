import type React from "react";
import type { Metadata } from "next";
import { getAllCompanies } from "@/lib/services/company/actions";
import type { Company } from "@/lib/services/company/models";
import { DashboardWrapper } from "@/components/dashboard/dashboard-wrapper";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CheckIt - Auditing & Checklist Management",
  description:
    "Professional auditing and checklist management platform for teams and companies",
  generator: "v0.dev",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let companies: Company[] = [];
  let loading = false;
  let error: string | null = null;

  try {
    loading = true;
    companies = await getAllCompanies();
    loading = false;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load companies";
    loading = false;
  }

  return (
    <>
      <DashboardWrapper companies={companies} loading={loading} error={error}>
        {children}
      </DashboardWrapper>
      <Toaster />
    </>
  );
}
