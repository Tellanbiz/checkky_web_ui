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
  const { data: sections = [], isLoading, error } = useSections();


  const handleEditSection = (section: Section) => {
    router.push(`/dashboard/sections/${section.id}`);
  };


  if (error) {
    return (
      <div className="space-y-6 p-8">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error.message}</p>
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4">
        {/* Search, Filters and Action Buttons Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4">
          <div className="relative w-full lg:max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <Button
              onClick={() => router.push("/dashboard/sections/new")}
              className="flex-shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Add Section</span>
              <span className="lg:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sections Table - Desktop */}
      <div className="hidden sm:block rounded-md border">
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
                      <Button
                        onClick={() => router.push("/dashboard/sections/new")}
                      >
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
                  <TableCell>{section.size_ha || "-"} ha</TableCell>
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

      {/* Mobile Cards Layout */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading sections...
              </p>
            </div>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
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
                  <Button
                    onClick={() => router.push("/dashboard/sections/new")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          filteredSections.map((section: Section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {section.name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{section.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <span className="ml-1 text-gray-900">
                          {section.size_ha || "-"} ha
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Workers:</span>
                        <span className="ml-1 text-gray-900">
                          {section.live?.workers || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Active:</span>
                        <span className="ml-1 text-gray-900">
                          {section.live?.active || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection(section)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
