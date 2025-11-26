"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, PlayCircle, PauseCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkflowsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("running");

  const handleNewWorkflow = () => {
    router.push("/dashboard/workflows/new");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
            {/* Tab-specific Filters */}
            {activeTab === "running" && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search workflows..."
                    className="pl-10 bg-white"
                  />
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button variant="outline" className="bg-white">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "stopped" && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search workflows..."
                    className="pl-10 bg-white"
                  />
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button variant="outline" className="bg-white">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={() => handleNewWorkflow()}>
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Tab Contents */}
        <TabsContent value="running" className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <PlayCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Running Workflows</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create your first automated workflow to get started.
            </p>
            <Button onClick={() => handleNewWorkflow()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="stopped" className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <PauseCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Stopped Workflows</h3>
            <p className="text-sm text-gray-600">
              Stopped workflows will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}