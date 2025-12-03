"use client";

import { Button } from "@/components/ui/button";
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
  Plus,
  Download,
  Eye,
  Loader2,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getAllChecklists } from "@/lib/services/checklist/actions";
import { CheckList } from "@/lib/services/checklist/models";
import { useRouter } from "next/navigation";
import { useAvailableFilters } from "@/lib/provider/checklists/index";

export function AvailableChecklist() {
  const { toast } = useToast();
  const router = useRouter();
  const [checklists, setChecklists] = useState<CheckList[]>([]);
  const [loading, setLoading] = useState(true);

  // Get filter state from context
  const filters = useAvailableFilters();

  // Fetch checklists on component mount
  useEffect(() => {
    fetchChecklists();
  }, []);

  // Fetch checklists with search term
  const fetchChecklists = async (name?: string) => {
    try {
      setLoading(true);
      const data = await getAllChecklists(name);
      setChecklists(data || []);
    } catch (error) {
      console.error("Failed to fetch checklists:", error);
      toast({
        title: "Error",
        description: "Failed to load available checklists. Please try again.",
        variant: "destructive",
      });
      // Fallback to empty array
      setChecklists([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const filteredAndSortedChecklists = checklists
    .filter((checklist) => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const nameMatch = checklist.name.toLowerCase().includes(searchLower);
        const descriptionMatch = checklist.description?.toLowerCase().includes(searchLower);
        if (!nameMatch && !descriptionMatch) {
          return false;
        }
      }

      // Category filter (if available in checklist data)
      if (filters.category !== 'all') {
        // Add category filtering logic here if checklist has category field
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "recent":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleDownloadChecklist = (checklist: CheckList) => {
    toast({
      title: "Download Started",
      description: `Downloading: ${checklist.name}`,
    });
    // Here you would handle the actual download
  };

  const handleViewChecklist = (checklist: CheckList) => {
    router.push(`/dashboard/checklists/${checklist.id}`);
  };

  const handleAssignChecklist = (checklist: CheckList) => {
    router.push(`/dashboard/checklists/assign/${checklist.id}`);
  };

  const handleUseTemplate = (checklist: CheckList) => {
    toast({
      title: "Template Selected",
      description: `Using template: ${checklist.name}`,
    });
    // Here you would navigate to create checklist with this template
  };

  return (
    <div className="space-y-4">
      {/* Empty filters section - filters are now handled at page level */}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Loading checklists...
          </span>
        </div>
      )}

      {/* Available Checklists Grid */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedChecklists.map((checklist) => (
            <div
              key={checklist.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewChecklist(checklist)}
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-lg">{checklist.name}</h3>
                  {checklist.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {checklist.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{checklist.section_count} sections</span>
                  <span>{checklist.item_count} items</span>
                </div>

                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    onClick={() => handleAssignChecklist(checklist)}
                  >
                    <Users className="mr-2 h-3 w-3" />
                    Assign
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChecklist(checklist)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State (if no checklists) */}
      {!loading && filteredAndSortedChecklists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No available checklists</p>
            <p className="text-sm">
              {filters.searchTerm
                ? `No checklists found for "${filters.searchTerm}"`
                : "Check back later for new templates and standards."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
