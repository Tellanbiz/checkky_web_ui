import type React from "react";
import type { Metadata } from "next";
import { DashboardWrapper } from "@/components/dashboard/dashboard-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/lib/shared/query_provider";

// Force dynamic rendering to prevent static generation issues with cookies
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkky - Auditing & Checklist Management",
  description:
    "Professional auditing and checklist management platform for teams and companies",
  generator: "v0.dev",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <DashboardWrapper>{children}</DashboardWrapper>
      <Toaster />
    </QueryProvider>
  );
}
