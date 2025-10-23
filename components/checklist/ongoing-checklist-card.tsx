import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { AssignedChecklist } from "@/lib/services/checklist/models";

interface OngoingChecklistCardProps {
  checklist: AssignedChecklist;
  onClick: (checklist: AssignedChecklist) => void;
  onDeleteChecklist: (checklist: AssignedChecklist) => void;
  handleDragStart: (e: React.DragEvent, checklistId: string) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent, priority: "high" | "mid" | "low") => void;
  draggedItem: string | null;
  updatingIds: Set<string>;
}

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function OngoingChecklistCard({
  checklist,
  onClick,
  onDeleteChecklist,
  handleDragStart,
  handleDragEnd,
  handleDrop,
  draggedItem,
  updatingIds,
}: OngoingChecklistCardProps) {
  const progress =
    checklist.checklist_progress.total_questions > 0
      ? (checklist.checklist_progress.answered_questions /
          checklist.checklist_progress.total_questions) *
        100
      : 0;

  return (
    <Card
      draggable={!updatingIds.has(checklist.id)}
      onDragStart={(e) => handleDragStart(e, checklist.id)}
      onDragEnd={handleDragEnd}
      onDrop={(e) => handleDrop(e, checklist.priority)}
      onClick={() => onClick(checklist)}
      className={`relative cursor-pointer hover:shadow-sm transition-all duration-200 bg-white border border-gray-200 ${
        draggedItem === checklist.id ? "opacity-50" : ""
      } rounded-lg ${updatingIds.has(checklist.id) ? "pointer-events-none" : ""}`}
    >
      {updatingIds.has(checklist.id) && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <CardHeader className="pb-2 px-3 pt-3 relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold truncate">{checklist.title}</CardTitle>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{checklist.notes}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                // Handle menu actions
              }}
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-red-100"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChecklist(checklist);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div className="space-y-2.5">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
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
            <Badge 
              variant={getPriorityBadgeVariant(checklist.priority)} 
              className="text-xs px-1.5 py-0.5 h-auto font-normal capitalize"
            >
              {checklist.priority}
            </Badge>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>
                {checklist.checklist_progress.answered_questions}/
                {checklist.checklist_progress.total_questions}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{checklist.assigned_member.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(checklist.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}