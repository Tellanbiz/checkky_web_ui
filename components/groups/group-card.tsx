import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FolderOpen, Settings } from "lucide-react";
import type { Group } from "@/lib/services/groups";

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  isUpdatePending?: boolean;
  isDeletePending?: boolean;
}

function getColorForGroup(groupName: string): string {
  const colors = [
    "bg-red-100 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-orange-100 text-orange-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-yellow-100 text-yellow-800",
    "bg-gray-100 text-gray-800",
  ];

  let hash = 0;
  for (let i = 0; i < groupName.length; i++) {
    hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function GroupCard({
  group,
  onEdit,
  onDelete,
  isUpdatePending = false,
  isDeletePending = false,
}: GroupCardProps) {
  const groupColor = getColorForGroup(group.name);
  const iconBgColor = groupColor.split(" ")[0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{group.name}</h3>
            <Badge className={groupColor}>{group.name}</Badge>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(group)}
            disabled={isUpdatePending}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(group)}
            className="text-red-600 hover:text-red-700"
            disabled={isDeletePending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {group.description || "No description provided"}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 text-gray-500">
          <Settings className="h-4 w-4" />
          <span>{group.no_of_checklists} checklists</span>
        </div>
        <span className="text-xs text-gray-400">
          Created {new Date(group.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
