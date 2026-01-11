"use client";

import { Loader2 } from "lucide-react";

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  threshold: number;
  style: React.CSSProperties;
}

export function PullToRefreshIndicator({
  isPulling,
  isRefreshing,
  pullDistance,
  threshold,
  style,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const rotation =
    pullDistance > 0 ? Math.min((pullDistance / threshold) * 360, 360) : 0;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={style}
    >
      <div className="bg-white rounded-full shadow-lg p-3 flex items-center justify-center">
        {isRefreshing ? (
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        ) : (
          <div
            className="w-6 h-6 text-primary transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
