import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Edit,
  Trash2,
  ArrowRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { Group } from "@/lib/services/groups";

interface GroupCardProps {
  group: Group;
  onEdit?: (group: Group) => void;
  onDelete?: (group: Group) => void;
  isUpdatePending?: boolean;
  isDeletePending?: boolean;
  showActions?: boolean;
  showChecklistCount?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function GroupCard({
  group,
  onEdit,
  onDelete,
  isUpdatePending = false,
  isDeletePending = false,
  showActions = true,
  showChecklistCount = true,
  hasChildren = false,
  isExpanded = false,
  onToggle,
  className,
}: GroupCardProps) {
  return (
    <div
      className={cn(
        "group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer overflow-hidden text-left w-full hover:bg-gray-50",
        className,
      )}
      onClick={() => {
        if (hasChildren && onToggle) {
          onToggle();
        }
      }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggle?.();
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
              <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                {group.name}
              </h3>
              {showChecklistCount && (
                <Badge variant="secondary" className="text-xs">
                  {group.no_of_checklists}
                </Badge>
              )}
            </div>
            {group.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1.5">
                {group.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <Button
                variant="outline"
                className="flex-1 h-9 border-gray-300 hover:bg-primary hover:text-primary-foreground text-gray-700 font-medium text-sm rounded-full transition-colors"
                size="sm"
                onClick={() => onEdit(group)}
                disabled={isUpdatePending}
              >
                <Edit className="mr-1.5 h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                className="h-9 px-3 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 font-medium text-sm rounded-full transition-colors"
                size="sm"
                onClick={() => onDelete(group)}
                disabled={isDeletePending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
