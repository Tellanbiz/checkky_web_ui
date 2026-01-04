"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PublicChecklist } from "@/lib/services/checklist/models";
import { getPublicChecklists } from "@/lib/services/checklist/get";
import { copyChecklist } from "@/lib/services/checklist/post";
import { useToast } from "@/hooks/use-toast";
import {
  BadgeDollarSign,
  ChevronDown,
  ChevronUp,
  Cpu,
  Factory,
  GraduationCap,
  HardHat,
  HeartPulse,
  Hotel,
  Landmark,
  Leaf,
  Pickaxe,
  Recycle,
  Search,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  Zap,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { AddChecklistDialog } from "@/components/templates/add-checklist-dialog";
import { TemplateCard } from "@/components/templates/template-card";
import { useQuery } from "@tanstack/react-query";

const CATEGORIES = [
  { value: "none", label: "All", icon: Search },
  { value: "agriculture", label: "Agriculture", icon: Leaf },
  { value: "construction", label: "Construction", icon: HardHat },
  { value: "manufacturing", label: "Manufacturing", icon: Factory },
  { value: "healthcare", label: "Healthcare", icon: HeartPulse },
  { value: "food_processing", label: "Food Processing", icon: UtensilsCrossed },
  { value: "transportation", label: "Transportation", icon: Truck },
  { value: "retail", label: "Retail", icon: ShoppingBag },
  { value: "hospitality", label: "Hospitality", icon: Hotel },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "government", label: "Government", icon: Landmark },
  { value: "technology", label: "Technology", icon: Cpu },
  { value: "energy", label: "Energy", icon: Zap },
  { value: "mining", label: "Mining", icon: Pickaxe },
  { value: "waste_management", label: "Waste Management", icon: Recycle },
  {
    value: "financial_services",
    label: "Financial Services",
    icon: BadgeDollarSign,
  },
] as const;

export default function TemplatesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]["value"]>("none");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PublicChecklist | null>(null);

  // Fetch templates with TanStack Query
  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
  } = useQuery({
    queryKey: ["templates", searchTerm, selectedCategory],
    queryFn: () =>
      getPublicChecklists(searchTerm || "none", 0, selectedCategory),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check if we need to refresh (coming from template copying)
  useEffect(() => {
    if (searchParams.get("refresh") === "true") {
      // Remove the refresh parameter
      const newUrl = window.location.pathname;
      router.replace(newUrl);
      
      // Trigger a refresh by invalidating the query
      refetchTemplates();
    }
  }, [searchParams, router, refetchTemplates]);

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

      // Navigate to checklists page with available tab and refresh flag
      router.push("/dashboard/checklists/available?refresh=true");
    } catch (error) {
      console.error("Failed to copy checklist:", error);
      toast({
        title: "Error",
        description:
          "Failed to copy checklist to your collection. Please try again.",
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
              {templatesError instanceof Error
                ? templatesError.message
                : "Failed to load templates"}
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
      <div className="space-y-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {!showAllCategories ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2 sm:flex-1 sm:overflow-x-auto sm:whitespace-nowrap sm:pb-1">
              {CATEGORIES.slice(0, 6).map((category) => (
                <Button
                  key={category.value}
                  type="button"
                  size="sm"
                  variant={
                    selectedCategory === category.value ? "default" : "outline"
                  }
                  className="rounded-full whitespace-nowrap text-xs sm:text-sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <category.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">
                    {category.label.slice(0, 8)}
                  </span>
                </Button>
              ))}
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full whitespace-nowrap text-xs sm:text-sm self-start sm:self-auto"
              onClick={() => setShowAllCategories(true)}
            >
              <span className="hidden sm:inline">Show more</span>
              <span className="sm:hidden">More</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Categories</div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="whitespace-nowrap"
                onClick={() => setShowAllCategories(false)}
              >
                Show less
                <ChevronUp className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  type="button"
                  size="sm"
                  variant={
                    selectedCategory === category.value ? "default" : "outline"
                  }
                  className="rounded-full justify-start"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      {templatesLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 text-sm sm:text-base">
              Loading templates...
            </p>
          </div>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="text-gray-500 text-center px-4">
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
