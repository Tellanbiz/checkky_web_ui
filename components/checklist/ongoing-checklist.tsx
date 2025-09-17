"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  GripVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getAssignedChecklistsAction } from "@/lib/services/checklist/actions";
import { AssignedChecklist } from "@/lib/services/checklist/models";

interface OngoingChecklistProps {
  onEditChecklist: (checklist: any) => void;
  onDeleteChecklist: (checklist: any) => void;
  onViewDetails: (checklist: any) => void;
}

const getPriorityDisplayName = (priority: string) => {
  switch (priority) {
    case "high":
      return "Major Must";
    case "mid":
      return "Minor Must";
    case "low":
      return "Optional";
    default:
      return priority;
  }
};

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "mid":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusDisplayName = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "pending":
      return "In Progress";
    default:
      return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-600";
    case "pending":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function OngoingChecklist({
  onEditChecklist,
  onDeleteChecklist,
  onViewDetails,
}: OngoingChecklistProps) {
  const { toast } = useToast();
  const [checklists, setChecklists] = useState<AssignedChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const fetchChecklists = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAssignedChecklistsAction();
      if (result.success && result.data) {
        setChecklists(result.data);
      } else {
        setError(result.error || "Failed to fetch checklists");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error fetching checklists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleDuplicateChecklist = (checklist: AssignedChecklist) => {
    toast({
      title: "Duplicate Checklist",
      description: `Duplicating: ${checklist.title}`,
    });
    // Here you would duplicate the checklist
  };

  const handleArchiveChecklist = (checklist: AssignedChecklist) => {
    toast({
      title: "Archive Checklist",
      description: `Archiving: ${checklist.title}`,
    });
    // Here you would archive the checklist
  };

  const handleDragStart = (e: React.DragEvent, checklistId: string) => {
    setDraggedItem(checklistId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newPriority: "high" | "mid" | "low") => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const updatedChecklists = checklists.map((checklist) =>
      checklist.id === draggedItem
        ? { ...checklist, priority: newPriority }
        : checklist
    );

    setChecklists(updatedChecklists);
    setDraggedItem(null);

    toast({
      title: "Priority Updated",
      description: `Checklist moved to ${getPriorityDisplayName(newPriority)}`,
    });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getChecklistsByPriority = (priority: "high" | "mid" | "low") => {
    return checklists.filter((checklist) => checklist.priority === priority);
  };

  const getColumnStyles = (priority: "high" | "mid" | "low") => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-white";
      case "mid":
        return "border-yellow-200 bg-white";
      case "low":
        return "border-green-200 bg-white";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const getColumnHeaderStyles = (priority: "high" | "mid" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-300 text-red-800";
      case "mid":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "low":
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchChecklists} disabled={loading}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search checklists..." className="pl-10" />
        </div>
      
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

      {/* Drag and Drop Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["high", "mid", "low"] as const).map((priority) => {
          const priorityChecklists = getChecklistsByPriority(priority);
          
          return (
            <div
              key={priority}
              className={`rounded-lg border-2 border-dashed ${getColumnStyles(priority)} min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, priority)}
            >
              {/* Column Header */}
              <div className={`p-4 border-b-2 ${getColumnHeaderStyles(priority)} rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    {getPriorityDisplayName(priority)}
                  </h3>
                  <Badge variant="outline" className="bg-white">
                    {priorityChecklists.length}
                  </Badge>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-3 space-y-3">
                {priorityChecklists.map((checklist) => {
                  const progress =
                    checklist.checklist_progress.total_questions > 0
                      ? (checklist.checklist_progress.answered_questions /
                          checklist.checklist_progress.total_questions) *
                        100
                      : 0;

                  return (
                    <Card
                      key={checklist.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, checklist.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onViewDetails(checklist)}
                      className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                        draggedItem === checklist.id ? "opacity-50" : ""
                      }`}
                    >
                      <CardHeader className="pb-2 px-3 pt-3">
                        <div className="flex flex-col items-start justify-between">
                            <CardTitle className="text-[15px] font-medium">{checklist.title}</CardTitle>
                            
                          <p className="text-xs text-gray-500">{checklist.notes}</p>
                        
                        </div>
                      </CardHeader>
                      <CardContent className="px-3 pb-3">
                        <div className="space-y-2">
                          {/* Status */}
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(checklist.status)}
                            <span
                              className={`text-xs font-medium ${getStatusColor(
                                checklist.status
                              )}`}
                            >
                              {getStatusDisplayName(checklist.status)}
                            </span>
                          </div>

                          {/* Progress */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>
                                {checklist.checklist_progress.answered_questions}/
                                {checklist.checklist_progress.total_questions}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-[#16A34A] h-1.5 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-2.5 w-2.5" />
                              <span className="truncate">{checklist.assigned_member.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-2.5 w-2.5" />
                              <span>{formatDate(checklist.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {priorityChecklists.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No checklists in this priority</p>
                    <p className="text-xs mt-1">Drag checklists here to change priority</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
