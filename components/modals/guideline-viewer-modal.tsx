"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Video,
  Download,
  Share,
  Edit,
  Calendar,
  User,
  Star,
  X,
  Play,
  Pause,
  Volume2,
  Maximize,
} from "lucide-react"
import { useState } from "react"

interface GuidelineViewerModalProps {
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

export function GuidelineViewerModal({ isOpen, onClose, guideline }: GuidelineViewerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("15:30")

  const handleDownload = () => {
    console.log("Downloading guideline:", guideline.title)
    // Here you would handle download
  }

  const handleShare = () => {
    console.log("Sharing guideline:", guideline.title)
    // Here you would handle sharing
  }

  const handleEdit = () => {
    console.log("Editing guideline:", guideline.title)
    onClose()
    // Here you would open edit modal
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              {guideline.type === "Video" ? (
                <Video className="h-5 w-5 text-purple-600" />
              ) : (
                <FileText className="h-5 w-5 text-blue-600" />
              )}
              <span>{guideline.title}</span>
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="mr-2 h-3 w-3" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guideline Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
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
                  <Badge
                    variant={guideline.status === "Published" ? "default" : "outline"}
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
                </div>
                <div className="text-sm text-muted-foreground">
                  Version {guideline.version} • {guideline.size}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Viewer */}
          <Card>
            <CardContent className="p-0">
              {guideline.type === "Video" ? (
                <div className="space-y-4">
                  {/* Video Player */}
                  <div className="relative bg-black rounded-t-lg aspect-video flex items-center justify-center">
                    <div className="text-center text-white space-y-4">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                      <p className="text-lg font-medium">{guideline.title}</p>
                      <p className="text-sm opacity-75">Click to play video</p>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {currentTime} / {duration}
                      </span>
                      <Button variant="outline" size="sm">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {/* PDF/Document Viewer */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Document Preview</h3>
                    <p className="text-muted-foreground mb-4">
                      {guideline.title} - {guideline.size}
                    </p>
                    <div className="space-y-2">
                      <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download to View
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        PDF documents can be downloaded and viewed in your browser or PDF reader
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guideline Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Author</p>
                    <p className="font-medium">{guideline.author}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(guideline.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                    <p className="font-medium">{guideline.downloads}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">(4.2)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This comprehensive guideline provides detailed instructions and best practices for{" "}
                  {guideline.category.toLowerCase()} operations. It includes step-by-step procedures, safety protocols,
                  and quality assurance measures to ensure optimal results.
                </p>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Topics Covered:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Safety procedures and protocols</li>
                    <li>• Quality control measures</li>
                    <li>• Best practice recommendations</li>
                    <li>• Troubleshooting common issues</li>
                    <li>• Compliance requirements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comments/Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-48">
                <div className="space-y-4">
                  {[
                    {
                      user: "John Smith",
                      comment: "Very helpful guideline! The step-by-step instructions are clear and easy to follow.",
                      date: "2 days ago",
                      rating: 5,
                    },
                    {
                      user: "Sarah Johnson",
                      comment: "Great resource for our team. Would love to see more examples in future updates.",
                      date: "1 week ago",
                      rating: 4,
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{review.user}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
