"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Video, Plus, X } from "lucide-react"
import { useState } from "react"

interface NewGuidelineModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewGuidelineModal({ isOpen, onClose }: NewGuidelineModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
    description: "",
    version: "1.0",
    status: "Draft",
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Auto-detect type based on file
      if (file.type.includes("video")) {
        setFormData({ ...formData, type: "Video" })
      } else {
        setFormData({ ...formData, type: "PDF" })
      }
    }
  }

  const handleSubmit = () => {
    console.log("Creating guideline:", formData)
    console.log("Uploaded file:", uploadedFile)
    onClose()
    // Here you would create the guideline
  }

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Guideline</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Guideline Title *</Label>
              <Input
                id="title"
                placeholder="Enter guideline title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Livestock">Livestock</SelectItem>
                    <SelectItem value="Crop Farming">Crop Farming</SelectItem>
                    <SelectItem value="Flower Farming">Flower Farming</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF Document</SelectItem>
                    <SelectItem value="Video">Video Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the guideline"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="1.0"
                  value={formData.version}
                  onChange={(e) => updateFormData("version", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateFormData("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label>Upload File *</Label>
                {!uploadedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <div className="flex justify-center space-x-4">
                        <FileText className="h-12 w-12 text-gray-400" />
                        <Video className="h-12 w-12 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">Upload your guideline file</p>
                        <p className="text-sm text-muted-foreground">
                          Support for PDF documents and video files (MP4, MOV, AVI)
                        </p>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept=".pdf,.mp4,.mov,.avi"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button asChild>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Choose File
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {formData.type === "Video" ? (
                        <Video className="h-8 w-8 text-purple-500" />
                      ) : (
                        <FileText className="h-8 w-8 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setUploadedFile(null)}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.title && formData.category && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Label>Preview</Label>
                  <div className="space-y-2">
                    <h4 className="font-semibold">{formData.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{formData.category}</Badge>
                      {formData.type && (
                        <Badge
                          variant="secondary"
                          className={
                            formData.type === "Video" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }
                        >
                          {formData.type === "Video" ? (
                            <Video className="w-3 h-3 mr-1" />
                          ) : (
                            <FileText className="w-3 h-3 mr-1" />
                          )}
                          {formData.type}
                        </Badge>
                      )}
                      <Badge
                        variant={formData.status === "Published" ? "default" : "secondary"}
                        className={
                          formData.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : formData.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-orange-100 text-orange-800"
                        }
                      >
                        {formData.status}
                      </Badge>
                    </div>
                    {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Version: {formData.version}</span>
                      <span>Created: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title || !formData.category || !uploadedFile}>
              <Plus className="mr-2 h-4 w-4" />
              Create Guideline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
