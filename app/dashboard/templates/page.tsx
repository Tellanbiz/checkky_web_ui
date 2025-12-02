"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PublicChecklist } from "@/lib/services/checklist/models";
import { getPublicChecklists } from "@/lib/services/checklist/get";
import { assignChecklist } from "@/lib/services/checklist/actions";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Building, Calendar, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCompanies } from "@/lib/services/company/get";
import { getAccessToken } from "@/lib/services/auth/auth-get";
import type { Company } from "@/lib/services/company/models";

export default function TemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<PublicChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PublicChecklist | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState("");
  const [checklistDescription, setChecklistDescription] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async (search?: string) => {
    try {
      setLoading(true);
      const data = await getPublicChecklists(search);
      setTemplates(data || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast({
        title: "Error",
        description: "Failed to load templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchTemplates(value);
  };

  const fetchCompanies = async () => {
    try {
      setCompaniesLoading(true);
      const token = await getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const data = await getCompanies(token);
      setCompanies(data || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      toast({
        title: "Error",
        description: "Failed to load companies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleAddToMyChecklist = (template: PublicChecklist) => {
    setSelectedTemplate(template);
    setSelectedCompany(null);
    setChecklistTitle(template.name);
    setChecklistDescription(template.description || "");
    setShowCompanyDialog(true);
    fetchCompanies();
  };

  const handleConfirmAdd = async () => {
    if (!selectedTemplate || !selectedCompany) return;
    
    try {
      setAssigningId(selectedTemplate.id);
      
      await assignChecklist({
        checklist_id: selectedTemplate.id,
        member_id: "current-user", // You might need to get this from auth context
        section_id: "default", // You might need to handle this differently
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        title: checklistTitle, // Use editable title
        notes: checklistDescription, // Use editable description
        priority: "mid" as const, // Default priority
      });

      toast({
        title: "Success!",
        description: `"${selectedTemplate.name}" has been added to your checklists.`,
      });
      
      setShowCompanyDialog(false);
      setSelectedTemplate(null);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Failed to assign checklist:", error);
      toast({
        title: "Error",
        description: "Failed to add checklist to your collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAssigningId(null);
    }
  };

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
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading templates...</p>
          </div>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {template.name}
                    </CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      <Building className="h-3 w-3 mr-1" />
                      {template.company.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {template.section_count} sections
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(template.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{template.item_count} items</span>
                  </div>

                  <Button
                      className="w-full"
                      onClick={() => handleAddToMyChecklist(template)}
                      disabled={assigningId === template.id}
                    >
                      {assigningId === template.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add to My Checklist
                        </>
                      )}
                    </Button>
                </CardContent>
              </Card>
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
        
        {/* Company Selection Dialog */}
        <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add to My Checklist</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={checklistTitle}
                  onChange={(e) => setChecklistTitle(e.target.value)}
                  placeholder="Enter checklist title..."
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={checklistDescription}
                  onChange={(e) => setChecklistDescription(e.target.value)}
                  placeholder="Enter checklist description..."
                  className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Company Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Company</label>
                {companiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : companies.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedCompany?.id === company.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedCompany(company)}
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{company.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No companies available
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCompanyDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAdd}
                  disabled={!selectedCompany || !checklistTitle.trim() || assigningId !== null}
                >
                  {assigningId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    "Add to Checklist"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}