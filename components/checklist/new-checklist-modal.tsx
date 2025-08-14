"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Paperclip, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { createChecklist } from "@/lib/services/checklist/actions";
import { CreateChecklistData } from "@/lib/services/checklist/service-post";

interface NewChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewChecklistModal({ isOpen, onClose }: NewChecklistModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
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

  const handleCreate = async () => {
    if (!formData.name || !checklistFile) {
      toast({
        title: "Validation Error",
        description: "Please fill in the name and upload a checklist file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const checklistData: CreateChecklistData = {
        name: formData.name,
        description: formData.description,
        checklist: checklistFile,
      };

      await createChecklist(checklistData);

      toast({
        title: "Success",
        description: "Checklist created successfully!",
      });

      onClose();
      // Reset form
      setFormData({
        name: "",
        category: "",
        description: "",
      });
      setChecklistFile(null);
    } catch (error) {
      console.error("Failed to create checklist:", error);
      toast({
        title: "Error",
        description: "Failed to create checklist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Checklist</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Checklist Name *</Label>
            <Input
              id="name"
              placeholder="Enter checklist name..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Livestock">Livestock</SelectItem>
                <SelectItem value="Crop Farming">Crop Farming</SelectItem>
                <SelectItem value="Flower Farming">Flower Farming</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter checklist description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* File Upload */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label>Upload Checklist CSV *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center space-y-2">
                    <Paperclip className="h-8 w-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium">
                        Import checklist data from CSV
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Upload a CSV file to bulk import checklist items,
                        sections, and requirements
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
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
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
                        className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* CSV Format Help */}
                <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-800 mb-1">
                    CSV Format Requirements:
                  </p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• First row should contain column headers</li>
                    <li>
                      • Required columns: Section, Question, Requirement Code,
                      Mandatory (Yes/No)
                    </li>
                    <li>• Optional columns: Guidance, Order Index</li>
                    <li>• Use commas to separate values</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-transparent"
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name || !checklistFile || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Checklist
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
