"use client";

import { useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TextField from "@/components/common/text-field";
import { Button } from "@/components/ui/button";
import { PreviewWidgetFactory } from "@/components/checklist/forms/PreviewWidgetFactory";
import { SearchIcon, FileTextIcon, Users, Info, Loader2, Edit3 } from "lucide-react";
import { getChecklistsInfo } from "@/lib/services/checklist/actions";
import { updateChecklistItem } from "@/lib/services/checklist/post";
import { ChecklistItemUpdateData } from "@/lib/services/checklist/models";
import { ChecklistItemEditDialog } from "@/components/checklist/checklist-item-edit-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Simple Table of Contents component for regular checklists
function ChecklistTableOfContents({ 
  checklist, 
  onSectionClick, 
  activeSection 
}: { 
  checklist: any; 
  onSectionClick: (sectionIndex: number) => void; 
  activeSection?: number;
}) {
  return (
    <div className="h-fit sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <FileTextIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Table of Contents</h3>
        </div>
        <p className="text-sm text-gray-600 truncate">{checklist.name}</p>
      </div>

      {/* Sections List */}
      <div className="space-y-1">
        {checklist.sections.map((section: any, sectionIndex: number) => {
          const isActive = activeSection === sectionIndex;
          const totalQuestions = section.questions.length;

          return (
            <div key={sectionIndex} className="rounded-lg overflow-hidden border border-gray-200 bg-white">
              <div
                className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                    : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
                onClick={() => onSectionClick(sectionIndex)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {section.order_index}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {section.question_group}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {totalQuestions} {totalQuestions === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChecklistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<number | undefined>();
  const [editingItem, setEditingItem] = useState<(ChecklistItemUpdateData & { policy: string | null }) | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // TanStack Query for fetching checklist data
  const {
    data: checklist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checklist", id],
    queryFn: () => getChecklistsInfo(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const filteredSections = checklist?.sections.filter((section: any) => {
    const matchesSection = section.question_group
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesQuestions = section.questions.some(
      (question: any) =>
        question.checklist_item_caption
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.question_group
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.question_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesSection || matchesQuestions;
  });

  const tocSections = filteredSections ?? [];
  const getSectionId = (orderIndex: number) => `section-${orderIndex}`;
  const scrollToSection = (orderIndex: number) => {
    setActiveSection(orderIndex);
    const el = document.getElementById(getSectionId(orderIndex));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAssignChecklist = () => {
    router.push(`/dashboard/checklists/assign/${id}`);
  };

  const updateItemMutation = useMutation({
    mutationFn: updateChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist", id] });
      setEditingItem(null);
    },
  });

  const openEditItem = (question: any, section: any) => {
    setEditingItem({
      id: question.id,
      order_index: section.order_index,
      question_group: question.question_group || section.question_group,
      checklist_item_caption: question.checklist_item_caption,
      question_type: question.question_type,
      default_answer: question.default_answer,
      photo_available: question.photo_available || "No",
      answer_options: question.answer_options || [],
      corrective_option: question.corrective_option || "",
      corrective_actions: question.corrective_actions || [],
      policy: question.policy,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">
            Loading checklist details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Checklist
          </h3>
          <p className="text-sm text-red-600">
            Failed to load checklist details. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileTextIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg text-gray-500 font-medium">
            Checklist not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                    {checklist.name}
                  </h1>
                </div>
                
              </div>

              <div className="flex flex-row space-x-4 gap-3 sm:items-end">
                {checklist.description && (
                    <Button
                      variant="outline"
                      onClick={() => setDescriptionDialogOpen(true)}
                      className="text-xs rounded-full"
                    >
                      Show Description
                    </Button>
                )}

                {/* Assign Button */}
                <Button
                  onClick={handleAssignChecklist}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full text-sm w-full sm:w-auto justify-center"
                  size="sm"
                >
                  <Users className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Assign Checklist</span>
                  <span className="sm:hidden">Assign</span>
                </Button>

                {/* Search Field */}
                <div className="relative w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <TextField
                    placeholder="Search sections and questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-2 w-full border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Table of Contents */}
        <div className="lg:hidden w-full border-b border-gray-200 bg-white">
          <div className="p-4">
            <ChecklistTableOfContents 
              checklist={checklist} 
              onSectionClick={scrollToSection} 
              activeSection={activeSection}
            />
          </div>
        </div>

        {/* Sidebar - Table of Contents (Desktop Only) */}
        <div className="hidden lg:block w-80 border-r border-gray-200 bg-white">
          <div className="sticky top-0 p-4 max-h-screen overflow-y-auto">
            <ChecklistTableOfContents 
              checklist={checklist} 
              onSectionClick={scrollToSection} 
              activeSection={activeSection}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Questions by Section */}
            {filteredSections?.length === 0 ? (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse all sections below.
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {filteredSections?.map((section: any) => (
                  <div
                    key={section.order_index}
                    id={getSectionId(section.order_index)}
                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <span className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                          {section.order_index}
                        </span>
                        <span className="break-words">
                          {section.question_group}
                        </span>
                      </h2>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                      {section.questions
                        .filter(
                          (question: any) =>
                            question.checklist_item_caption
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            question.question_group
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            question.question_type
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                        .map((question: any) => (
                          <div
                            key={question.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-all"
                          >
                            <div className="mb-3 flex justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-white"
                                onClick={() => openEditItem(question, section)}
                              >
                                <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                                Edit item
                              </Button>
                            </div>
                            <PreviewWidgetFactory question={question} />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description Dialog */}
      <Dialog open={descriptionDialogOpen} onOpenChange={setDescriptionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Checklist Description
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Full details for {checklist.name}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
              {checklist.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ChecklistItemEditDialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        question={editingItem}
        isSaving={updateItemMutation.isPending}
        onSave={(data) => updateItemMutation.mutate(data)}
      />
    </div>
  );
}
