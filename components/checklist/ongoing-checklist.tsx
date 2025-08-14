"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  User,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface OngoingChecklistProps {
  onEditChecklist: (checklist: any) => void;
  onDeleteChecklist: (checklist: any) => void;
  onViewDetails: (checklist: any) => void;
}

export function OngoingChecklist({
  onEditChecklist,
  onDeleteChecklist,
  onViewDetails,
}: OngoingChecklistProps) {
  const { toast } = useToast();

  const checklists = [
    {
      id: 1,
      title: "Livestock Health Inspection - Farm A",
      category: "Livestock",
      priority: "Major Must",
      status: "In Progress",
      assignee: "John Smith",
      dueDate: "2024-01-15",
      progress: 75,
      tasks: 12,
      completedTasks: 9,
    },
    {
      id: 2,
      title: "Crop Quality Assessment - Field 3",
      category: "Crop Farming",
      priority: "Minor Must",
      status: "Pending",
      assignee: "Sarah Johnson",
      dueDate: "2024-01-16",
      progress: 0,
      tasks: 8,
      completedTasks: 0,
    },
    {
      id: 3,
      title: "Equipment Maintenance Check",
      category: "General",
      priority: "Major Must",
      status: "Overdue",
      assignee: "Mike Wilson",
      dueDate: "2024-01-10",
      progress: 45,
      tasks: 15,
      completedTasks: 7,
    },
    {
      id: 4,
      title: "Flower Farm Quality Control",
      category: "Flower Farming",
      priority: "Optional",
      status: "Completed",
      assignee: "Emma Davis",
      dueDate: "2024-01-12",
      progress: 100,
      tasks: 10,
      completedTasks: 10,
    },
  ];

  const handleDuplicateChecklist = (checklist: any) => {
    toast({
      title: "Duplicate Checklist",
      description: `Duplicating: ${checklist.title}`,
    });
    // Here you would duplicate the checklist
  };

  const handleArchiveChecklist = (checklist: any) => {
    toast({
      title: "Archive Checklist",
      description: `Archiving: ${checklist.title}`,
    });
    // Here you would archive the checklist
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search checklists..." className="pl-10" />
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
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Checklist Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {checklists.map((checklist) => (
          <Card
            key={checklist.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{checklist.title}</CardTitle>
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
                      className={
                        checklist.priority === "Minor Must"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                    >
                      {checklist.priority}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEditChecklist(checklist)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicateChecklist(checklist)}
                    >
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleArchiveChecklist(checklist)}
                    >
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteChecklist(checklist)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center space-x-2">
                  {checklist.status === "Completed" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {checklist.status === "In Progress" && (
                    <Clock className="h-4 w-4 text-blue-500" />
                  )}
                  {checklist.status === "Overdue" && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  {checklist.status === "Pending" && (
                    <Clock className="h-4 w-4 text-gray-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      checklist.status === "Completed"
                        ? "text-green-600"
                        : checklist.status === "In Progress"
                        ? "text-blue-600"
                        : checklist.status === "Overdue"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {checklist.status}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {checklist.completedTasks}/{checklist.tasks} tasks
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#16A34A] h-2 rounded-full transition-all"
                      style={{ width: `${checklist.progress}%` }}
                    />
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{checklist.assignee}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{checklist.dueDate}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => onViewDetails(checklist)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
