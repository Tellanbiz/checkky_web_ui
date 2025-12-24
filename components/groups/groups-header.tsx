import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";

interface GroupsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onAddGroup: () => void;
}

export function GroupsHeader({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onAddGroup,
}: GroupsHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search, Filters and Action Buttons Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4">
        <div className="relative w-full lg:max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search groups..."
            className="pl-10 bg-white w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full lg:w-[140px] bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="created">Created</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={onAddGroup}
            className="flex-shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Add Group</span>
            <span className="lg:hidden">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
