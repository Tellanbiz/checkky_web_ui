"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Settings", href: "/dashboard/account/settings", icon: Settings },
  { label: "Billing", href: "/dashboard/account/billing", icon: CreditCard },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="">
        <div className="flex gap-1 border-b border-neutral-200 mb-8">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors",
                  isActive
                    ? "border-black text-black"
                    : "border-transparent text-black/40 hover:text-black/70",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="px-8">{children}</div>
      </div>
    </div>
  );
}
