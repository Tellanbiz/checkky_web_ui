import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "../../components/navigation/sidebar";
import { Header } from "./components/header";
import { Toaster } from "../../components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CheckIt - Auditing & Checklist Management",
  description:
    "Professional auditing and checklist management platform for teams and companies",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
