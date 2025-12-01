import type React from "react";
import type { Metadata } from "next";
import { getAllCompanies } from "@/lib/services/company/actions";
import type { Company } from "@/lib/services/company/models";
import { DashboardWrapper } from "@/components/dashboard/dashboard-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { Account } from "@/lib/services/accounts/models";
import { getAccount } from "@/lib/services/auth/auth-get";
import { redirect } from "next/navigation";
import { WebSocketProvider } from "@/lib/socket/socket";
import { QueryProvider } from "@/lib/shared/query_provider";

// Force dynamic rendering to prevent static generation issues with cookies
export const dynamic = "force-dynamic";

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
  let account: Account | undefined = undefined;
  let loading = false;
  let error: string | null = null;

  try {
    loading = true;
    companies = await getAllCompanies();
    account = await getAccount();
    loading = false;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load companies";
    loading = false;
  }

  // If user has no companies, redirect to continue page
  if (!loading && companies.length === 0) {
    redirect("/auth");
  }

  // If user has companies but none selected, redirect to companies page
  if (
    !loading &&
    companies.length > 0 &&
    account &&
    !account.current_company_id
  ) {
    redirect("/dashboard");
  }

  return (
    <>
      <QueryProvider>
        <DashboardWrapper
          companies={companies}
          loading={loading}
          error={error}
          account={account}
        >
          {children}
        </DashboardWrapper>
        <Toaster />
      </QueryProvider>
    </>
  );
}
