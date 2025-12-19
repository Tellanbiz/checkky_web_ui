"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  X,
  Paperclip,
  Upload,
  Trash2,
  FileText,
  Info,
  Share2,
  FolderOpen,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GroupTableSelector } from "@/components/checklist/group-table-selector";
import { useToast } from "@/hooks/use-toast";
import { useCreateChecklist } from "@/lib/services/checklists/hooks";

// Categories from the database schema
const CATEGORIES = [
  { value: "none", label: "None" },
  { value: "agriculture", label: "Agriculture" },
  { value: "construction", label: "Construction" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "food_processing", label: "Food Processing" },
  { value: "transportation", label: "Transportation" },
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality" },
  { value: "education", label: "Education" },
  { value: "government", label: "Government" },
  { value: "technology", label: "Technology" },
  { value: "energy", label: "Energy" },
  { value: "mining", label: "Mining" },
  { value: "waste_management", label: "Waste Management" },
  { value: "financial_services", label: "Financial Services" },
] as const;

export default function NewChecklistPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createChecklistMutation = useCreateChecklist();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessageIndex, setUploadMessageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    category: "none",
    description: "",
    isPublic: false,
    groupId: "none", // Optional group selection
  });
  const [checklistFile, setChecklistFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const supportedFormats = [
    { ext: "CSV", desc: "Comma-separated values" },
    { ext: "XLSX", desc: "Excel spreadsheet" },
    { ext: "XLS", desc: "Excel 97-2003 spreadsheet" },
    { ext: "ODS", desc: "OpenDocument spreadsheet" },
  ];

  const uploadMessages = [
    "Checking your checklist file…",
    "CheckIt is reading your CSV rows…",
    "Organizing sections and questions…",
    "Almost there — prepping your checklist…",
  ];

  useEffect(() => {
    if (!createChecklistMutation.isPending) {
      setUploadMessageIndex(0);
      return;
    }

    setUploadMessageIndex(0);
    const id = window.setInterval(() => {
      setUploadMessageIndex((prev) => (prev + 1) % uploadMessages.length);
    }, 2500);

    return () => window.clearInterval(id);
  }, [createChecklistMutation.isPending, uploadMessages.length]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setChecklistFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is a supported format
      const supportedExtensions = [".csv", ".xlsx", ".xls", ".ods"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (supportedExtensions.includes(fileExtension)) {
        setChecklistFile(file);
      } else {
        toast({
          title: "Unsupported File Format",
          description: "Please upload a CSV, XLSX, XLS, or ODS file.",
          variant: "destructive",
        });
      }
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

    // Validate category selection (cannot be "none")
    if (!formData.category || formData.category === "none") {
      toast({
        title: "Validation Error",
        description: "Please select a category for the checklist.",
        variant: "destructive",
      });
      return;
    }

    // Check if public checklist requires description
    if (
      formData.isPublic &&
      (!formData.description || formData.description.trim().length < 50)
    ) {
      toast({
        title: "Validation Error",
        description:
          "Public checklists require a description of at least 50 characters.",
        variant: "destructive",
      });
      return;
    }

    setUploadProgress(0);

    try {
      await createChecklistMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        checklist_group_id:
          formData.groupId !== "none" ? formData.groupId : undefined,
        checklist: checklistFile,
        isPublic: formData.isPublic,
        onProgress: setUploadProgress,
      });

      toast({
        title: "Checklist Created Successfully!",
        description: `Your checklist "${formData.name}" has been created and is now available for use in workflows.`,
      });

      router.push("/dashboard/checklists/my");
    } catch (error) {
      setUploadProgress(0);
      // Error handling is done in the hook
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/checklists/my");
  };

  return (
    <div className="min-h-full bg-white">
      <Dialog open={createChecklistMutation.isPending} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Uploading Checklist</DialogTitle>
            <DialogDescription>
              {uploadMessages[uploadMessageIndex]}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Upload progress</span>
              <span className="font-medium text-gray-900">
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Keep this tab open while CheckIt finishes the upload.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Page Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Create New Checklist
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={createChecklistMutation.isPending}
                className="flex-shrink-0"
              >
                <X className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">Cancel</span>
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={
                  !formData.name ||
                  !checklistFile ||
                  !formData.category ||
                  formData.category === "none" ||
                  createChecklistMutation.isPending ||
                  (formData.isPublic &&
                    (!formData.description ||
                      formData.description.trim().length < 50))
                }
                className="px-3 sm:px-4 py-2 text-sm flex-shrink-0"
              >
                {createChecklistMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Creating...</span>
                    <span className="sm:hidden">Creating</span>
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Create Checklist</span>
                    <span className="sm:hidden">Create</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Industry Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the industry that best describes this checklist's
                  purpose
                </p>
              </div>

              {/* Group Selection (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="group">Group (Optional)</Label>
                <GroupTableSelector
                  selectedGroupId={formData.groupId}
                  onGroupChange={(value) =>
                    setFormData({ ...formData, groupId: value })
                  }
                  disabled={createChecklistMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description {formData.isPublic && "*"}{" "}
                </Label>
                <Textarea
                  id="description"
                  placeholder={
                    formData.isPublic
                      ? "Provide a detailed description (at least 50 characters) to help other users understand this checklist..."
                      : "Enter checklist description..."
                  }
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className={
                    formData.isPublic &&
                    (!formData.description ||
                      formData.description.trim().length < 50)
                      ? "border-red-300 focus:border-red-500"
                      : ""
                  }
                />
                {formData.isPublic && (
                  <div className="text-xs text-muted-foreground">
                    {formData.description ? (
                      <span
                        className={
                          formData.description.trim().length >= 50
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {formData.description.trim().length}/50 characters
                        minimum
                      </span>
                    ) : (
                      <span className="text-orange-600">
                        Description is required for public checklists
                      </span>
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
                    Public checklists can be discovered and used by other users
                    in the system
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
                Upload your checklist data to import questions and requirements.
                Supports CSV, XLSX, XLS, and ODS formats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Checklist File *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
                  <div
                    className={`text-center space-y-3 transition-colors ${
                      isDragOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Paperclip className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isDragOver
                          ? "Drop your file here"
                          : "Import checklist data from file"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isDragOver
                          ? "Release to upload your checklist file"
                          : "Upload a file to bulk import checklist items, sections, and requirements"}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs text-gray-500">
                      {supportedFormats.map((format) => (
                        <span
                          key={format.ext}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded-md text-xs"
                        >
                          {format.ext}
                        </span>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.ods"
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
                        Choose File
                      </label>
                    </Button>
                  </div>
                </div>

                {/* Display uploaded file */}
                {checklistFile && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Uploaded File:
                    </Label>
                    <div className="flex items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg border gap-2">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <Paperclip className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm text-gray-700 truncate block">
                            {checklistFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(checklistFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0 flex-shrink-0"
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
                    <p className="font-medium">File Format Requirements:</p>
                    <ul className="space-y-1 text-sm ml-4 list-disc">
                      <li>Supported formats: CSV, XLSX, XLS, ODS</li>
                      <li>
                        CSV files should have columns: Section, Question,
                        Requirement Code, Mandatory (Yes/No)
                      </li>
                      <li>Optional columns: Guidance, Order Index</li>
                      <li>Excel files should use the first row as headers</li>
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
                  <span>
                    Organize your checklist into logical sections for better
                    readability
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>
                    Use clear, concise language for questions and requirements
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Include guidance notes for complex requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>
                    Test your CSV format with a small sample before uploading
                    large files
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
