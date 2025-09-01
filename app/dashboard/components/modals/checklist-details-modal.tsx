"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckSquare,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ChecklistDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: {
    id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    assignee: string;
    dueDate: string;
    progress: number;
    tasks: number;
    completedTasks: number;
  };
}

export function ChecklistDetailsModal({
  isOpen,
  onClose,
  checklist,
}: ChecklistDetailsModalProps) {
  const router = useRouter();

  const handleViewChecklist = () => {
    router.push(`/dashboard/checklists/${checklist.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Checklist Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Checklist Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {checklist.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {checklist.category}
                    </Badge>
                    <Badge
                      variant={
                        checklist.priority === "Major Must"
                          ? "destructive"
                          : checklist.priority === "Minor Must"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {checklist.priority}
                    </Badge>
                    <Badge
                      variant={
                        checklist.status === "Completed" ? "default" : "outline"
                      }
                      className="text-xs"
                    >
                      {checklist.status === "Completed" && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {checklist.status === "In Progress" && (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {checklist.status === "Overdue" && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {checklist.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleViewChecklist}
                  className="ml-4 h-9 px-3 text-sm"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {checklist.progress}%
                  </span>
                </div>
                <Progress value={checklist.progress} className="h-2" />
                <p className="text-xs text-gray-500">
                  {checklist.completedTasks} of {checklist.tasks} tasks
                  completed
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Assigned</p>
                    <p className="text-sm font-medium">{checklist.assignee}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="text-sm font-medium">{checklist.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Total Tasks</p>
                    <p className="text-sm font-medium">{checklist.tasks}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-sm font-medium">
                      {checklist.completedTasks}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
