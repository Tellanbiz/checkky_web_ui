"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, Upload, Save, X, Trash2, Eye, Download } from "lucide-react"
import { useState } from "react"

interface EditGuidelineModalProps {
  isOpen: boolean
  onClose: () => void
  guideline: {
    id: number
    title: string
    category: string
    type: string
    version: string
    size: string
    downloads: number
    lastUpdated: string
    status: string
    author: string
  }
}

export function EditGuidelineModal({ isOpen, onClose, guideline }: EditGuidelineModalProps) {
  const [formData, setFormData] = useState({
    title: guideline.title,
    category: guideline.category,
    type: guideline.type,
    status: guideline.status,
    description:
      "This comprehensive guideline provides detailed instructions and best practices for livestock operations.",
    tags: "livestock, health, inspection, safety",
    version: guideline.version,
  })

  const handleSave = () => {
    console.log("Saving guideline:", formData)
    onClose()
  }

  const handleFileUpload = () => {
    console.log("Uploading new file version")
    // Here you would handle file upload
  }

  const handlePreview = () => {
    console.log("Previewing guideline")
    // Here you would open preview
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {guideline.type === "Video" ? (
              <Video className="h-5 w-5 text-purple-600" />
            ) : (
              <FileText className="h-5 w-5 text-blue-600" />
            )}
            <span>Edit Guideline</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="livestock, health, inspection, safety"
                />
              </div>
            </CardContent>
          </Card>

          {/* File Management */}
          <Card>
            <CardHeader>
              <CardTitle>File Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {guideline.type === "Video" ? (
                    <Video className="w-8 h-8 text-purple-600" />
                  ) : (
                    <FileText className="w-8 h-8 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium">{guideline.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {guideline.size} • Version {guideline.version} • {guideline.downloads} downloads
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePreview}>
                    <Eye className="mr-2 h-3 w-3" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Upload New Version</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium">Upload new file version</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.type === "Video" ? "MP4, AVI, MOV files up to 500MB" : "PDF files up to 50MB"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept={formData.type === "Video" ? ".mp4,.avi,.mov" : ".pdf"}
                      className="hidden"
                      id="guideline-file"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="guideline-file" className="cursor-pointer">
                        <Upload className="mr-2 h-3 w-3" />
                        Choose File
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="v1.0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">Current Status:</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant={
                        guideline.status === "Published"
                          ? "default"
                          : guideline.status === "Draft"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        guideline.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : guideline.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-orange-100 text-orange-800"
                      }
                    >
                      {guideline.status}
                    </Badge>
                    <span className="text-muted-foreground">
                      Last updated: {new Date(guideline.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Guideline
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="bg-transparent">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
