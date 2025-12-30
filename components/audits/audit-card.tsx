"use client";

import { useRouter } from "next/navigation";
import { User, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { GetOngoingAuditsRow } from "@/lib/services/auditors/data";

interface AuditCardProps {
  audit: GetOngoingAuditsRow;
  getPriorityColor: (priority: string) => string;
  getStatusColor?: (status: string) => string;
  getInitials: (name: string) => string;
  formatDate: (dateString: string) => string;
  calculateProgress: (total: number, completed: number) => number;
  isCompleted?: boolean;
}

export function AuditCard({
  audit,
  getPriorityColor,
  getStatusColor,
  getInitials,
  formatDate,
  calculateProgress,
  isCompleted = false,
}: AuditCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/checklists/answers/${audit.id}`);
  };

  return (
    <div 
      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer hover:shadow-md"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">
            {audit.title}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className={`text-xs ${getPriorityColor(audit.priority)}`}
            >
              {audit.priority}
            </Badge>
            {isCompleted ? (
              <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                Completed
              </Badge>
            ) : (
              getStatusColor && (
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(audit.status)}`}
                >
                  {audit.status}
                </Badge>
              )
            )}
          </div>
        </div>
        
        {audit.auditor && (
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage
              src={audit.auditor.picture}
              alt={audit.auditor.full_name}
            />
            <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
              {getInitials(audit.auditor.full_name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-2">
          <User className="w-3 h-3" />
          <span>
            Assignee: {audit.assigned_member?.name || "Unassigned"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3" />
          <span>
            Auditor: {audit.auditor?.full_name || "Unassigned"}
          </span>
        </div>
        <div>Created: {formatDate(audit.created_at)}</div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Checklist Progress</span>
            <span>
              {audit.checklist_progress.answered_questions}/
              {audit.checklist_progress.total_questions}
            </span>
          </div>
          <Progress
            value={calculateProgress(
              audit.checklist_progress.total_questions,
              audit.checklist_progress.answered_questions
            )}
            className="h-2"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Audit Progress</span>
            <span>
              {audit.audit_progress.scored_answers}/
              {audit.audit_progress.total_answers}
            </span>
          </div>
          <Progress
            value={calculateProgress(
              audit.audit_progress.total_answers,
              audit.audit_progress.scored_answers
            )}
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
}