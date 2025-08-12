"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FileText, Video, Download, Eye, Edit, Trash2, Upload, Share } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NewGuidelineModal } from "../components/modals/new-guideline-modal"
import { GuidelineViewerModal } from "../components/modals/guideline-viewer-modal"
import { EditGuidelineModal } from "../components/modals/edit-guideline-modal"

const GuidelinesPage = () => {
  const guidelines = [
    {
      id: 1,
      title: "Livestock Health Inspection Protocol",
      category: "Livestock",
      type: "PDF",
      version: "v2.1",
      size: "2.4 MB",
      downloads: 156,
      lastUpdated: "2024-01-10",
      status: "Published",
      author: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      title: "Crop Quality Assessment Video Guide",
      category: "Crop Farming",
      type: "Video",
      version: "v1.3",
      size: "45.2 MB",
      downloads: 89,
      lastUpdated: "2024-01-08",
      status: "Published",
      author: "Mike Wilson",
    },
    {
      id: 3,
      title: "Equipment Maintenance Checklist",
      category: "General",
      type: "PDF",
      version: "v1.0",
      size: "1.8 MB",
      downloads: 234,
      lastUpdated: "2024-01-05",
      status: "Draft",
      author: "John Smith",
    },
    {
      id: 4,
      title: "Flower Farm Safety Procedures",
      category: "Flower Farming",
      type: "PDF",
      version: "v1.5",
      size: "3.1 MB",
      downloads: 67,
      lastUpdated: "2024-01-12",
      status: "Published",
      author: "Emma Davis",
    },
    {
      id: 5,
      title: "Organic Certification Process",
      category: "Crop Farming",
      type: "Video",
      version: "v2.0",
      size: "67.8 MB",
      downloads: 123,
      lastUpdated: "2024-01-15",
      status: "Published",
      author: "Lisa Brown",
    },
    {
      id: 6,
      title: "Animal Welfare Standards",
      category: "Livestock",
      type: "PDF",
      version: "v1.2",
      size: "4.2 MB",
      downloads: 198,
      lastUpdated: "2024-01-03",
      status: "Under Review",
      author: "Dr. Sarah Johnson",
    },
  ]

  const [selectedGuideline, setSelectedGuideline] = useState<any>(null)
  const [showNewGuidelineModal, setShowNewGuidelineModal] = useState(false)
  const [showViewerModal, setShowViewerModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGuidelineForView, setSelectedGuidelineForView] = useState<any>(null)
  const [selectedGuidelineForEdit, setSelectedGuidelineForEdit] = useState<any>(null)

  const handlePreview = (guideline: any) => {
    console.log("Previewing:", guideline.title)
    // Here you would open a preview modal
  }

  const handleDownload = (guideline: any) => {
    console.log("Downloading:", guideline.title)
    // Here you would trigger download
  }

  const handleShare = (guideline: any) => {
    console.log("Sharing:", guideline.title)
    // Here you would open share options
  }

  const handleEdit = (guideline: any) => {
    setSelectedGuidelineForEdit(guideline)
    setShowEditModal(true)
  }

  const handleDelete = (guideline: any) => {
    console.log("Deleting:", guideline.title)
    // Here you would show delete confirmation
  }

  const handleViewGuideline = (guideline: any) => {
    setSelectedGuidelineForView(guideline)
    setShowViewerModal(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Guidelines Hub</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button onClick={() => setShowNewGuidelineModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Guideline
          </Button>
        </div>
      </div>

      {/* Guidelines Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guidelines</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">67% published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">867</div>
            <p className="text-xs text-muted-foreground">+45 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Guides</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">33% video content</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search guidelines..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="livestock">Livestock</SelectItem>
            <SelectItem value="crop">Crop Farming</SelectItem>
            <SelectItem value="flower">Flower Farming</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guidelines Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guidelines.map((guideline) => (
          <Card key={guideline.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{guideline.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{guideline.category}</Badge>
                    <Badge
                      variant="secondary"
                      className={
                        guideline.type === "Video" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      }
                    >
                      {guideline.type === "Video" ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <FileText className="w-3 h-3 mr-1" />
                      )}
                      {guideline.type}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePreview(guideline)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(guideline)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(guideline)}>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(guideline)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(guideline)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
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
                  <span className="text-sm text-muted-foreground">{guideline.version}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{guideline.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Downloads</p>
                    <p className="font-medium">{guideline.downloads}</p>
                  </div>
                </div>

                {/* Author and Date */}
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    By: <span className="font-medium">{guideline.author}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Updated: {new Date(guideline.lastUpdated).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleViewGuideline(guideline)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleDownload(guideline)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <NewGuidelineModal isOpen={showNewGuidelineModal} onClose={() => setShowNewGuidelineModal(false)} />
      {selectedGuidelineForView && (
        <GuidelineViewerModal
          isOpen={showViewerModal}
          onClose={() => setShowViewerModal(false)}
          guideline={selectedGuidelineForView}
        />
      )}

      {selectedGuidelineForEdit && (
        <EditGuidelineModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          guideline={selectedGuidelineForEdit}
        />
      )}
    </div>
  )
}

export default GuidelinesPage
