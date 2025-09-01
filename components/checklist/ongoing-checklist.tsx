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
        {checklists.map((checklist) => {
          const progress =
            checklist.checklist_progress.total_questions > 0
              ? (checklist.checklist_progress.answered_questions /
                  checklist.checklist_progress.total_questions) *
                100
              : 0;

          return (
            <Card
              key={checklist.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{checklist.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">General</Badge>
                      <Badge
                        variant={getPriorityBadgeVariant(checklist.priority)}
                        className={
                          checklist.priority === "mid"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                      >
                        {getPriorityDisplayName(checklist.priority)}
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
                    {getStatusIcon(checklist.status)}
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        checklist.status
                      )}`}
                    >
                      {getStatusDisplayName(checklist.status)}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {checklist.checklist_progress.answered_questions}/
                        {checklist.checklist_progress.total_questions} questions
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#16A34A] h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{checklist.assigned_member.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(checklist.created_at)}</span>
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
          );
        })}
      </div>
    </div>
  );
}
