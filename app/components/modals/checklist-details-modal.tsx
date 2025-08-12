"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckSquare, Calendar, User, Clock, AlertTriangle, CheckCircle, Paperclip, Upload, Eye } from "lucide-react"
import { useState } from "react"

interface ChecklistDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  checklist: {
    id: number
    title: string
    category: string
    priority: string
    status: string
    assignee: string
    dueDate: string
    progress: number
    tasks: number
    completedTasks: number
  }
}

export function ChecklistDetailsModal({ isOpen, onClose, checklist }: ChecklistDetailsModalProps) {
  const [taskResponses, setTaskResponses] = useState<{ [key: number]: { response: string; notes: string } }>({})

  const checklistTasks = [
    {
      id: 1,
      title: "Check animal health records",
      description: "Verify all livestock have up-to-date health documentation",
      completed: true,
      response: "yes",
      notes: "All records are current and properly filed",
      evidence: ["health_records.pdf"],
    },
    {
      id: 2,
      title: "Inspect feeding areas",
      description: "Ensure feeding areas are clean and properly maintained",
      completed: true,
      response: "yes",
      notes: "Feeding areas cleaned and restocked",
      evidence: ["feeding_area_photo.jpg"],
    },
    {
      id: 3,
      title: "Verify water supply quality",
      description: "Test water quality and ensure adequate supply",
      completed: false,
      response: "",
      notes: "",
      evidence: [],
    },
    {
      id: 4,
      title: "Check fencing and barriers",
      description: "Inspect all fencing for damage or wear",
      completed: false,
      response: "",
      notes: "",
      evidence: [],
    },
  ]

  const handleTaskResponse = (taskId: number, response: string, notes: string) => {
    setTaskResponses({
      ...taskResponses,
      [taskId]: { response, notes },
    })
  }

  const handleFileUpload = (taskId: number) => {
    console.log("Uploading evidence for task:", taskId)
    // Here you would handle file upload
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checklist Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Checklist Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{checklist.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{checklist.category}</Badge>
                    <Badge
                      variant={
                        checklist.priority === "Major Must"
                          ? "destructive"
                          : checklist.priority === "Minor Must"
                            ? "secondary"
                            : "outline"
                      }
                      className={checklist.priority === "Minor Must" ? "bg-yellow-100 text-yellow-800" : ""}
                    >
                      {checklist.priority}
                    </Badge>
                    <Badge
                      variant={checklist.status === "Completed" ? "default" : "outline"}
                      className={
                        checklist.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : checklist.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : checklist.status === "Overdue"
                              ? "bg-red-100 text-red-800"
                              : ""
                      }
                    >
                      {checklist.status === "Completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {checklist.status === "In Progress" && <Clock className="w-3 h-3 mr-1" />}
                      {checklist.status === "Overdue" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {checklist.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{checklist.assignee}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{checklist.dueDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {checklist.completedTasks}/{checklist.tasks} tasks
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{checklist.progress}% Complete</span>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={checklist.progress} className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {checklistTasks.map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Checkbox checked={task.completed} />
                                <h4 className="font-medium">{task.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            </div>
                          </div>

                          {/* Yes/No Response */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Response:</label>
                            <div className="flex space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`task-${task.id}`}
                                  value="yes"
                                  checked={task.response === "yes"}
                                  onChange={(e) =>
                                    handleTaskResponse(task.id, e.target.value, taskResponses[task.id]?.notes || "")
                                  }
                                  className="text-green-600"
                                />
                                <span className="text-sm">Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`task-${task.id}`}
                                  value="no"
                                  checked={task.response === "no"}
                                  onChange={(e) =>
                                    handleTaskResponse(task.id, e.target.value, taskResponses[task.id]?.notes || "")
                                  }
                                  className="text-red-600"
                                />
                                <span className="text-sm">No</span>
                              </label>
                            </div>
                          </div>

                          {/* Notes Section */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Notes:</label>
                            <Textarea
                              placeholder="Add any additional notes or comments..."
                              value={task.notes}
                              onChange={(e) => handleTaskResponse(task.id, task.response, e.target.value)}
                              rows={2}
                            />
                          </div>

                          {/* Evidence Upload */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Evidence:</label>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleFileUpload(task.id)}>
                                <Upload className="mr-2 h-3 w-3" />
                                Upload Evidence
                              </Button>
                              {task.evidence.length > 0 && (
                                <div className="flex space-x-2">
                                  {task.evidence.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs"
                                    >
                                      <Paperclip className="h-3 w-3" />
                                      <span>{file}</span>
                                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              <CheckSquare className="mr-2 h-4 w-4" />
              Save Progress
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
