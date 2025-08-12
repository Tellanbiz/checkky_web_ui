"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, Paperclip, Upload, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NewChecklistModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Task {
  id: number
  title: string
  description: string
}

export function NewChecklistModal({ isOpen, onClose }: NewChecklistModalProps) {
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    assignee: "",
    description: "",
  })
  const [tasks, setTasks] = useState<Task[]>([{ id: 1, title: "", description: "" }])

  const addTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: "",
      description: "",
    }
    setTasks([...tasks, newTask])
  }

  const removeTask = (taskId: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const updateTask = (taskId: number, field: keyof Task, value: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, [field]: value } : task)))
  }

  const handleCreate = () => {
    console.log("Creating checklist:", { formData, tasks, date })
    onClose()
    // Reset form
    setFormData({
      title: "",
      category: "",
      priority: "",
      assignee: "",
      description: "",
    })
    setTasks([{ id: 1, title: "", description: "" }])
    setDate(undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Checklist</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Checklist Title *</Label>
            <Input
              id="title"
              placeholder="Enter checklist title..."
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
                  <SelectValue placeholder="Select category" />
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
              <Label>Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Major Must">Major Must</SelectItem>
                  <SelectItem value="Minor Must">Minor Must</SelectItem>
                  <SelectItem value="Optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assign To *</Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => setFormData({ ...formData, assignee: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                  <SelectItem value="Lisa Brown">Lisa Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter checklist description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Tasks Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tasks *</CardTitle>
                <Button variant="outline" size="sm" onClick={addTask}>
                  <Plus className="mr-2 h-3 w-3" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task, index) => (
                <Card key={task.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Task {index + 1}</Label>
                        {tasks.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(task.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Task Title *</Label>
                        <Input
                          placeholder="Enter task title..."
                          value={task.title}
                          onChange={(e) => updateTask(task.id, "title", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Task Description</Label>
                        <Textarea
                          placeholder="Enter task description..."
                          value={task.description}
                          onChange={(e) => updateTask(task.id, "description", e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                        <strong>Note:</strong> Each task will include Yes/No response options and a notes section for
                        additional information.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label>Attach Reference Files (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center space-y-2">
                    <Paperclip className="h-8 w-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium">Upload reference files</p>
                      <p className="text-xs text-muted-foreground">
                        Images, PDFs, or documents to help with checklist completion
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      id="checklist-files"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="checklist-files" className="cursor-pointer">
                        <Upload className="mr-2 h-3 w-3" />
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !formData.title ||
                !formData.category ||
                !formData.priority ||
                !formData.assignee ||
                !date ||
                tasks.some((task) => !task.title.trim())
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Checklist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
