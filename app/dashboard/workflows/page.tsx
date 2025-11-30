"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, PlayCircle, PauseCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getWorkflows,
  searchWorkflows,
} from "@/lib/services/workflows/services-get";
import {
  Workflow,
  WorkflowStatus,
  ChecklistPriority,
} from "@/lib/services/workflows/models";
import { WorkflowCard } from "@/components/workflow/workflow_card";

export default function WorkflowsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("running");
  const [searchTerm, setSearchTerm] = useState("");

  // Query for workflows by status
  const {
    data: workflows = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["workflows", activeTab],
    queryFn: () => getWorkflows(activeTab),
    enabled: !searchTerm.trim(),
  });

  // Query for searched workflows
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ["workflows", "search", searchTerm, activeTab],
    queryFn: () =>
      searchWorkflows({
        title: searchTerm,
        status: activeTab,
      }),
    enabled: searchTerm.trim().length > 0,
  });

  const loading = searchTerm.trim() ? isSearching : isLoading;
  const displayWorkflows = searchTerm.trim() ? searchResults : workflows;

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
        <div className="flex items-center justify-between">
          <TabsList className="w-fit">
            <TabsTrigger value="running" className="px-6">
              <PlayCircle className="mr-2 h-4 w-4" />
              Running
            </TabsTrigger>
            <TabsTrigger value="stopped" className="px-6">
              <PauseCircle className="mr-2 h-4 w-4" />
              Stopped
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search workflows..."
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button variant="outline" className="bg-white">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>

            <Button onClick={() => handleNewWorkflow()}>
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </div>

        <TabsContent value="running" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading workflows...</p>
            </div>
          ) : displayWorkflows.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <PlayCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
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
                <Button onClick={() => handleNewWorkflow()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workflow
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onClick={handleWorkflowClick}
                  onMenu={handleMenuAction}
                  onDelete={handleDeleteWorkflow}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stopped" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading workflows...</p>
            </div>
          ) : displayWorkflows.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <PauseCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onClick={handleWorkflowClick}
                  onMenu={handleMenuAction}
                  onDelete={handleDeleteWorkflow}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
