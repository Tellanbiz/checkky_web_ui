"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuditsTabNavigation } from "../../../components/audits/navigation/tab-navigation";
import { OngoingAuditList } from "@/components/audits/ongoing-audit-list";
import { CompletedAuditList } from "@/components/audits/completed-audit-list";
import { getAudits } from "@/lib/services/auditors/get";

export default function AuditsPage() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "mid":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (total: number, completed: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // TanStack Query for ongoing audits
  const {
    data: ongoingAudits = [],
    isLoading: isLoadingOngoing,
    refetch: refetchOngoing,
  } = useQuery({
    queryKey: ["audits", "pending"],
    queryFn: () => getAudits("pending"),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // TanStack Query for completed audits
  const {
    data: completedAudits = [],
    isLoading: isLoadingCompleted,
    refetch: refetchCompleted,
  } = useQuery({
    queryKey: ["audits", "completed"],
    queryFn: () => getAudits("completed"),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Tab Navigation */}
      <AuditsTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Header with Search */}
      <div className="flex flex-col gap-4 p-3 sm:p-4 pt-4 sm:pt-6">
        {/* Search, Filters and Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:max-w-xs flex-1">
            {/* Add search functionality here if needed */}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-3 sm:px-4 lg:px-8 pb-8">
        {activeTab === "ongoing" ? (
          <OngoingAuditList
            audits={ongoingAudits}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
            getInitials={getInitials}
            formatDate={formatDate}
            calculateProgress={calculateProgress}
          />
        ) : (
          <CompletedAuditList
            audits={completedAudits}
            getPriorityColor={getPriorityColor}
            getInitials={getInitials}
            formatDate={formatDate}
            calculateProgress={calculateProgress}
          />
        )}
      </div>
    </div>
  );
}
