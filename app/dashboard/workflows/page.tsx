"use client";

import { useEffect, useState } from "react";
import { PauseCircle, PlayCircle, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowCard } from "@/components/workflow/workflow_card";
import { WorkflowListShimmer } from "@/components/workflow/workflow_list_shimmer";
import { getWorkflows } from "@/lib/services/workflows/get";

export default function WorkflowsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("running");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: workflows = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["workflows", searchTerm, activeTab],
    queryFn: () => getWorkflows(searchTerm || undefined, activeTab),
  });

  const { data: runningWorkflows = [] } = useQuery({
    queryKey: ["workflows", "summary", "running"],
    queryFn: () => getWorkflows(undefined, "running"),
    staleTime: 1000 * 60,
  });

  const { data: stoppedWorkflows = [] } = useQuery({
    queryKey: ["workflows", "summary", "stopped"],
    queryFn: () => getWorkflows(undefined, "stopped"),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);
    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [refetch]);

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  const handleNewWorkflow = () => {
    router.push("/dashboard/workflows/new");
  };

  const handleWorkflowClick = (id: string) => {
    router.push(`/dashboard/workflows/${id}`);
  };

  const emptyState = (
    icon: React.ReactNode,
    title: string,
    description: string,
  ) => (
    <Card className="bg-white">
      <CardContent className="px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {!searchTerm.trim() && activeTab === "running" && (
        <Button onClick={handleNewWorkflow} className="mt-5">
          <Plus className="mr-2 h-4 w-4" />
          Create workflow
        </Button>
      )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Workflows
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Manage active workflow schedules, review paused ones, and create new
            automations from the same workspace.
          </p>
        </div>

        <Button onClick={handleNewWorkflow} className="sm:min-w-[160px]">
          <Plus className="mr-2 h-4 w-4" />
          New workflow
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`bg-white transition-colors ${
            activeTab === "running" ? "border-primary" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("running")}
            className="w-full text-left"
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardDescription>Running workflows</CardDescription>
                  <CardTitle className="mt-2 text-3xl">
                    {runningWorkflows.length}
                  </CardTitle>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground">
                  <PlayCircle className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Workflows currently sending scheduled checklist runs to the team.
              </p>
            </CardContent>
          </button>
        </Card>

        <Card
          className={`bg-white transition-colors ${
            activeTab === "stopped" ? "border-primary" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("stopped")}
            className="w-full text-left"
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardDescription>Stopped workflows</CardDescription>
                  <CardTitle className="mt-2 text-3xl">
                    {stoppedWorkflows.length}
                  </CardTitle>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <PauseCircle className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Paused workflows that can be reviewed, updated, or restarted.
              </p>
            </CardContent>
          </button>
        </Card>
      </div>

      <Card className="bg-white">
        <CardContent className="p-4 md:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <TabsList className="w-full lg:w-fit">
                <TabsTrigger value="running" className="flex-1 lg:flex-initial">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Running
                </TabsTrigger>
                <TabsTrigger value="stopped" className="flex-1 lg:flex-initial">
                  <PauseCircle className="mr-2 h-4 w-4" />
                  Stopped
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  className="bg-white pl-10"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <TabsContent value="running" className="space-y-4">
              {isLoading ? (
                <WorkflowListShimmer />
              ) : workflows.length === 0 ? (
                emptyState(
                  <PlayCircle className="h-7 w-7" />,
                  searchTerm.trim() ? "No workflows found" : "No running workflows",
                  searchTerm.trim()
                    ? "Try a different workflow name or clear the search."
                    : "Create your first workflow and it will appear here once it is running.",
                )
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {workflows.map((workflow) => (
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
              {isLoading ? (
                <WorkflowListShimmer />
              ) : workflows.length === 0 ? (
                emptyState(
                  <PauseCircle className="h-7 w-7" />,
                  searchTerm.trim() ? "No workflows found" : "No stopped workflows",
                  searchTerm.trim()
                    ? "Try a different workflow name or clear the search."
                    : "Stopped workflows will appear here when you pause them.",
                )
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {workflows.map((workflow) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
