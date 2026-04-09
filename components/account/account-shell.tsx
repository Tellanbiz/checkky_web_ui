"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Settings2 } from "lucide-react";

import { cn } from "@/lib/utils";

const accountNavItems = [
  {
    title: "Account Settings",
    description: "Profile details and email verification",
    href: "/dashboard/profile",
    icon: Settings2,
  },
  {
    title: "Manage Billing",
    description: "Plans, invoices, and payment actions",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];

interface AccountShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AccountShell({
  title,
  description,
  children,
}: AccountShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-full bg-[#f7f8f4]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-3xl border border-[#d9decf] bg-white px-6 py-6 shadow-sm md:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#5f6c52]">
            Account & Billing
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172014]">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[#5f6757] md:text-base">
            {description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-[#d9decf] bg-white p-3 shadow-sm">
            <div className="space-y-2">
              {accountNavItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl px-4 py-4 transition-colors",
                      isActive
                        ? "bg-[#183a1d] text-white"
                        : "text-[#253121] hover:bg-[#f1f4ea]",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        isActive ? "bg-white/12" : "bg-[#eef3e5]",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-white" : "text-[#3f5437]",
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p
                        className={cn(
                          "mt-1 text-xs leading-5",
                          isActive ? "text-white/80" : "text-[#61715f]",
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0 space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
