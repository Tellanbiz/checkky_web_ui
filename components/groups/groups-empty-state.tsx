import { Button } from "@/components/ui/button";
import { FolderOpen, Plus } from "lucide-react";

interface GroupsEmptyStateProps {
  searchTerm: string;
  onAddGroup: () => void;
}

export function GroupsEmptyState({
  searchTerm,
  onAddGroup,
}: GroupsEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No groups found
      </h3>
      <p className="text-gray-500 mb-4">
        {searchTerm
          ? "Try adjusting your search terms"
          : "Create your first group to organize your checklists"}
      </p>
      {!searchTerm && (
        <Button onClick={onAddGroup}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Group
        </Button>
      )}
    </div>
  );
}
