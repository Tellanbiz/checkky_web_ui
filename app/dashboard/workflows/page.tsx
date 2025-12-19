"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, PlayCircle, PauseCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getWorkflows } from "@/lib/services/workflows/get";
import { Workflow } from "@/lib/services/workflows/models";
import { WorkflowCard } from "@/components/workflow/workflow_card";
import { WorkflowListShimmer } from "@/components/workflow/workflow_list_shimmer";

export default function WorkflowsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("running");
  const [searchTerm, setSearchTerm] = useState("");

  // Single query for workflows using getWorkflows
  const {
    data: workflows = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["workflows", searchTerm, activeTab],
    queryFn: () => getWorkflows(searchTerm || undefined, activeTab),
  });

  // Refresh data when page becomes visible (e.g., after navigation back from new workflow page)
  // Also refresh when switching tabs to ensure data is up-to-date
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also listen for focus events (when user switches back to the tab)
    window.addEventListener("focus", handleVisibilityChange);

    // Initial refresh when component mounts
    handleVisibilityChange();

    // Cleanup listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [refetch]);

  // Refresh data when tab changes to ensure stopped workflows are loaded
  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  const loading = isLoading;
  const displayWorkflows = workflows;

  const handleNewWorkflow = () => {
    router.push("/dashboard/workflows/new");
  };

  const handleWorkflowClick = (id: string) => {
    router.push(`/dashboard/workflows/${id}`);
  };

  const handleMenuAction = (workflow: Workflow) => {
    // Handle menu actions (edit, view details, etc.)
    console.log("Menu action for workflow:", workflow.id);
  };

  const handleDeleteWorkflow = (workflow: Workflow) => {
    // Handle delete workflow
    console.log("Delete workflow:", workflow.id);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4">
          {/* Tabs Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <TabsList className="w-full sm:w-fit">
              <TabsTrigger
                value="running"
                className="flex-1 sm:flex-initial px-3 sm:px-6 text-xs sm:text-sm"
              >
                <PlayCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Running</span>
                <span className="sm:hidden">Run</span>
              </TabsTrigger>
              <TabsTrigger
                value="stopped"
                className="flex-1 sm:flex-initial px-3 sm:px-6 text-xs sm:text-sm"
              >
                <PauseCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Stopped</span>
                <span className="sm:hidden">Stop</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search and Action Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search workflows..."
                className="pl-10 bg-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              onClick={() => handleNewWorkflow()}
              className="w-full sm:w-auto justify-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Workflow</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        <TabsContent value="running" className="space-y-4">
          {loading ? (
            <WorkflowListShimmer />
          ) : displayWorkflows.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500 px-4">
              <PlayCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {searchTerm.trim()
                  ? "No Workflows Found"
                  : "No Running Workflows"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {searchTerm.trim()
                  ? "Try adjusting your search terms."
                  : "Create your first automated workflow to get started."}
              </p>
              {!searchTerm.trim() && (
                <Button
                  onClick={() => handleNewWorkflow()}
                  className="w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create Workflow</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onClick={handleWorkflowClick}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stopped" className="space-y-4">
          {loading ? (
            <WorkflowListShimmer />
          ) : displayWorkflows.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500 px-4">
              <PauseCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {searchTerm.trim()
                  ? "No Workflows Found"
                  : "No Stopped Workflows"}
              </h3>
              <p className="text-sm text-gray-600">
                {searchTerm.trim()
                  ? "Try adjusting your search terms."
                  : "Stopped workflows will appear here."}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onClick={handleWorkflowClick}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
