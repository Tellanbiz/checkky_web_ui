import type React from "react";
import type { Metadata } from "next";
import { DashboardWrapper } from "@/components/dashboard/dashboard-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { Account } from "@/lib/services/accounts/models";
import { getAccount } from "@/lib/services/auth/auth-get";
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
  const account = await getAccount();

  return (
    <>
      <QueryProvider>
        <DashboardWrapper account={account}>{children}</DashboardWrapper>
        <Toaster />
      </QueryProvider>
    </>
  );
}
