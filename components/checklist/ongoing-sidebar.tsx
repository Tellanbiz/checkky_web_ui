import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CheckCircle, Clock, User, Calendar } from "lucide-react";
import { AssignedChecklist } from "@/lib/services/checklist/models";
import router from 'next/router';
import Link from 'next/link';

interface OngoingSidebarProps {
  checklist: AssignedChecklist | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteChecklist: (checklist: AssignedChecklist) => void;
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
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
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

export function OngoingSidebar({ checklist, isOpen, onClose, onCompleteChecklist }: OngoingSidebarProps) {
  if (!checklist) return null;

  const progress =
    checklist.checklist_progress.total_questions > 0
      ? (checklist.checklist_progress.answered_questions /
          checklist.checklist_progress.total_questions) *
        100
      : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-96">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-bold text-gray-900">Checklist Details</SheetTitle>
          <SheetDescription>
            View and manage checklist information
          </SheetDescription>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Title and Notes */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">{checklist.title}</h3>
            {checklist.notes && (
              <p className="text-gray-600 text-sm leading-relaxed">{checklist.notes}</p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Status and Priority */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(checklist.status)}
                <span className={`font-semibold ${getStatusColor(checklist.status)}`}>
                  {getStatusDisplayName(checklist.status)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Priority</span>
              <Badge variant={getPriorityBadgeVariant(checklist.priority)} className="capitalize text-xs">
                {checklist.priority}
              </Badge>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-semibold text-gray-900">
                {checklist.checklist_progress.answered_questions}/{checklist.checklist_progress.total_questions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-right">{Math.round(progress)}% complete</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Assigned Member */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Assigned To</p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{checklist.assigned_member.name}</p>
                <p className="text-xs text-gray-500">{checklist.assigned_member.email}</p>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Calendar className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Created</p>
              <p className="font-medium text-gray-900">{formatDate(checklist.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Footer with Action Button */}
        <div className="pt-6 border-t space-y-3">
          {checklist.assigned_member.can_answer && (
            <Link href={`/dashboard/checklists/answers/${checklist.id}`}>
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                Preview Checklist
              </Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}