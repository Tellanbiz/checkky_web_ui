"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PublicChecklist } from "@/lib/services/checklist/models";
import { getPublicChecklists } from "@/lib/services/checklist/get";
import { copyChecklist } from "@/lib/services/checklist/post";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddChecklistDialog } from "@/components/templates/add-checklist-dialog";
import { TemplateCard } from "@/components/templates/template-card";
import { useQuery } from "@tanstack/react-query";

export default function TemplatesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PublicChecklist | null>(null);

  // Fetch templates with TanStack Query
  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
  } = useQuery({
    queryKey: ["templates", searchTerm],
    queryFn: () => getPublicChecklists(searchTerm || "none"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddToMyChecklist = (template: PublicChecklist) => {
    setSelectedTemplate(template);
    setShowDialog(true);
  };

  const handleConfirmAdd = async (title: string, description: string) => {
    if (!selectedTemplate) return;
    
    try {
      setAssigningId(selectedTemplate.id);
      
      await copyChecklist({
        name: title,
        description: description,
        checklist_id: selectedTemplate.id,
      });

      toast({
        title: "Success!",
        description: `"${selectedTemplate.name}" has been copied to your checklists.`,
      });
      
      setShowDialog(false);
      setSelectedTemplate(null);
      
      // Navigate to checklists page with available tab
      router.push('/dashboard/checklists?tab=available');
    } catch (error) {
      console.error("Failed to copy checklist:", error);
      toast({
        title: "Error",
        description: "Failed to copy checklist to your collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAssigningId(null);
    }
  };

  // Handle errors
  if (templatesError) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Error loading templates</p>
            <p className="text-sm text-gray-600">
              {templatesError instanceof Error ? templatesError.message : 'Failed to load templates'}
            </p>
            <button 
              onClick={() => refetchTemplates()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {templatesLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading templates...</p>
          </div>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onAddToChecklist={handleAddToMyChecklist}
              isAssigning={assigningId === template.id}
            />
          ))}
        </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 text-center">
              <p className="text-lg font-medium mb-2">No templates found</p>
              <p className="text-sm">
                {searchTerm
                  ? `No templates found for "${searchTerm}"`
                  : "No public templates available at the moment."}
              </p>
            </div>
          </div>
        )}
        
        {/* Add Checklist Dialog */}
        <AddChecklistDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          template={selectedTemplate}
          onConfirm={handleConfirmAdd}
          isSubmitting={assigningId !== null}
        />
    </div>
  );
}