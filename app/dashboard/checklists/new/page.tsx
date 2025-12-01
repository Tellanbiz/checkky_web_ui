"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X, Paperclip, Upload, Trash2, FileText, Info, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createChecklist } from "@/lib/services/checklist/actions";
import { CreateChecklistData } from "@/lib/services/checklist/post";

export default function NewChecklistPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    isPublic: false,
  });
  const [checklistFile, setChecklistFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setChecklistFile(file);
    }
  };

  const removeFile = () => {
    setChecklistFile(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!formData.name || !checklistFile) {
      toast({
        title: "Validation Error",
        description: "Please fill in the name and upload a checklist file.",
        variant: "destructive",
      });
      return;
    }

    // Check if public checklist requires description
    if (formData.isPublic && (!formData.description || formData.description.trim().length < 50)) {
      toast({
        title: "Validation Error",
        description: "Public checklists require a description of at least 50 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate progress steps for checklist creation with longer delays
      const progressSteps = [
        { progress: 25, delay: 500 },
        { progress: 50, delay: 800 },
        { progress: 75, delay: 600 },
        { progress: 90, delay: 400 },
        { progress: 100, delay: 300 },
      ];

      // Execute progress steps
      for (const step of progressSteps) {
        await new Promise(resolve => {
          setTimeout(() => {
            setUploadProgress(step.progress);
            resolve(undefined);
          }, step.delay);
        });
      }

      const checklistData: CreateChecklistData = {
        name: formData.name,
        description: formData.description,
        checklist: checklistFile,
        isPublic: formData.isPublic,
      };

      await createChecklist(checklistData);

      toast({
        title: "Checklist Created Successfully!",
        description: `Your checklist "${formData.name}" has been created and is now available for use in workflows.`,
      });

      router.push("/dashboard/checklists");
    } catch (error) {
      console.error("Failed to create checklist:", error);
      toast({
        title: "Error",
        description: "Failed to create checklist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/checklists");
  };

  return (
    <div className="min-h-full bg-white">
      {/* Page Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Create New Checklist
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={!formData.name || !checklistFile || isSubmitting || (formData.isPublic && (!formData.description || formData.description.trim().length < 50))}
                className="px-4 py-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Checklist
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - Show only when submitting */}
      {isSubmitting && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Creating checklist...</span>
                <span className="text-gray-900 font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide the basic details for your checklist template.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Checklist Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter checklist name..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description {formData.isPublic && "*"} </Label>
                <Textarea
                  id="description"
                  placeholder={formData.isPublic ? "Provide a detailed description (at least 50 characters) to help other users understand this checklist..." : "Enter checklist description..."}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className={formData.isPublic && (!formData.description || formData.description.trim().length < 50) ? "border-red-300 focus:border-red-500" : ""}
                />
                {formData.isPublic && (
                  <div className="text-xs text-muted-foreground">
                    {formData.description ? (
                      <span className={formData.description.trim().length >= 50 ? "text-green-600" : "text-orange-600"}>
                        {formData.description.trim().length}/50 characters minimum
                      </span>
                    ) : (
                      <span className="text-orange-600">Description is required for public checklists</span>
                    )}
                  </div>
                )}
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="public" className="text-sm font-medium">
                      Make this checklist public
                    </Label>
                    <Share2 className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Public checklists can be discovered and used by other users in the system
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPublic: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Checklist Data
              </CardTitle>
              <CardDescription>
                Upload your checklist data as a CSV file to import questions and requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Checklist CSV *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center space-y-3">
                    <Paperclip className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Import checklist data from CSV
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Upload a CSV file to bulk import checklist items, sections, and requirements
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      id="checklist-file"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label
                        htmlFor="checklist-file"
                        className="cursor-pointer"
                      >
                        <Upload className="mr-2 h-3 w-3" />
                        Choose CSV File
                      </label>
                    </Button>
                  </div>
                </div>

                {/* Display uploaded file */}
                {checklistFile && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Uploaded CSV File:
                    </Label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {checklistFile.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(checklistFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* CSV Format Help */}
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="space-y-2">
                    <p className="font-medium">CSV Format Requirements:</p>
                    <ul className="space-y-1 text-sm ml-4 list-disc">
                      <li>First row should contain column headers</li>
                      <li>Required columns: Section, Question, Requirement Code, Mandatory (Yes/No)</li>
                      <li>Optional columns: Guidance, Order Index</li>
                      <li>Use commas to separate values</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Tips for Creating Checklists
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Organize your checklist into logical sections for better readability</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Use clear, concise language for questions and requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Include guidance notes for complex requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Test your CSV format with a small sample before uploading large files</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
