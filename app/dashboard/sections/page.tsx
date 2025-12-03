"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Plus, Search, Loader2, Edit } from "lucide-react";
import { Section } from "@/lib/services/sections/models";
import { useToast } from "@/hooks/use-toast";
import {
  useSections,
  SECTIONS_QUERY_KEY,
} from "@/components/sections/use-sections";

export default function SectionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // TanStack Query hooks
  const { data: sections = [], isLoading, error, refetch } = useSections();

  // Refresh data when page regains focus
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  const handleEditSection = (section: Section) => {
    router.push(`/dashboard/sections/${section.id}`);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (error) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Loader2 className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={handleRefresh} disabled={isLoading}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const filteredSections = sections.filter((section: Section) => {
    const matchesSearch =
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <Loader2
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => router.push("/dashboard/sections/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Sections Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Workers</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Loader2 className="mx-auto h-8 w-8 text-blue-500 animate-spin" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading sections...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredSections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    No sections found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search."
                      : "Get started by adding your first section."}
                  </p>
                  {!searchTerm && (
                    <div className="mt-4">
                      <Button onClick={() => router.push("/dashboard/sections/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Section
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredSections.map((section: Section) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.name}</TableCell>
                  <TableCell>{section.location}</TableCell>
                  <TableCell>{section.size_ha || '-'} ha</TableCell>
                  <TableCell>{section.live?.workers || 0}</TableCell>
                  <TableCell>{section.live?.active || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSection(section)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
