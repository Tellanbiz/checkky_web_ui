"use client";

import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/components/ui/pull-to-refresh-indicator";
import { usePathname, useRouter } from "next/navigation";

interface PullToRefreshProviderProps {
  children: React.ReactNode;
}

export function PullToRefreshProvider({
  children,
}: PullToRefreshProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    isPulling,
    pullDistance,
    isRefreshing,
    pullIndicatorStyle,
    shouldShow,
  } = usePullToRefresh({
    onRefresh: async () => {
      router.refresh();
    },
    threshold: 80,
    disabled: !pathname.startsWith("/dashboard"), // Only enable on dashboard routes
  });

  return (
    <>
      {children}
      {shouldShow && (
        <PullToRefreshIndicator
          isPulling={isPulling}
          isRefreshing={isRefreshing}
          pullDistance={pullDistance}
          threshold={80}
          style={pullIndicatorStyle}
        />
      )}
    </>
  );
}
