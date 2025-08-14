"use client";

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
import { Search, Filter, Plus, Download, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getAllChecklists } from "@/lib/services/checklist/actions";
import { CheckList } from "@/lib/services/checklist/models";
import { redirect } from "next/navigation";

export function AvailableChecklist() {
  const { toast } = useToast();
  const [checklists, setChecklists] = useState<CheckList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

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

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      fetchChecklists(value);
    } else {
      fetchChecklists();
    }
  };

  // Filter and sort checklists
  const filteredAndSortedChecklists = checklists
    .filter((checklist) => {
      if (selectedCategory === "all") return true;
      // Note: category filtering will work when you add category field to API
      return true; // Placeholder until category is added to API
    })
    .sort((a, b) => {
      switch (sortBy) {
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

  const handlePreviewChecklist = (checklist: CheckList) => {
    redirect(`/dashboard/checklists/${checklist.id}`);
    // Here you would open a preview modal
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
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search available checklists..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Updated</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

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
            <Card
              key={checklist.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{checklist.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Meta Info */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Created:</span>
                      <span>
                        {new Date(checklist.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sections:</span>
                      <span>{checklist.section_count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Items:</span>
                      <span>{checklist.item_count}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {checklist.description && (
                    <div className="text-sm text-muted-foreground">
                      <p className="line-clamp-2">{checklist.description}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => handleUseTemplate(checklist)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handlePreviewChecklist(checklist)}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownloadChecklist(checklist)}
                      >
                        <Download className="mr-2 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State (if no checklists) */}
      {!loading && filteredAndSortedChecklists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No available checklists</p>
            <p className="text-sm">
              {searchTerm
                ? `No checklists found for "${searchTerm}"`
                : "Check back later for new templates and standards."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
