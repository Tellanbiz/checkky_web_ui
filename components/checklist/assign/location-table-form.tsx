"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSections } from "@/lib/services/sections/get";
import { Section } from "@/lib/services/sections/models";
import { useToast } from "@/hooks/use-toast";

interface LocationTableFormProps {
  selectedSectionId: string;
  onSectionChange: (value: string) => void;
}

export function LocationTableForm({
  selectedSectionId,
  onSectionChange,
}: LocationTableFormProps) {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const farms = await getSections();
        setSections(farms);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
        toast({
          title: "Error",
          description: "Failed to load locations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [toast]);

  const filteredSections = sections.filter(
    (section) =>
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Location Assignment</CardTitle>
        <CardDescription className="text-sm">
          Select the area or section where this assignment will be active.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
            <div className="col-span-6">Location</div>
            <div className="col-span-6">Address</div>
          </div>

          {/* Table Body */}
          <RadioGroup value={selectedSectionId} onValueChange={onSectionChange}>
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm text-gray-400">
                    Loading locations...
                  </span>
                </div>
              ) : filteredSections.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">
                  No locations found
                </div>
              ) : (
                filteredSections.map((section) => (
                  <label
                    key={section.id}
                    className={cn(
                      "grid grid-cols-12 gap-2 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                      selectedSectionId === section.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      <RadioGroupItem
                        value={section.id}
                        className="border-gray-300 text-blue-600"
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          selectedSectionId === section.id
                            ? "text-blue-600"
                            : "text-gray-900"
                        )}
                      >
                        {section.name}
                      </span>
                    </div>
                    <div className="col-span-6 flex items-center text-sm text-gray-600">
                      {section.location}
                    </div>
                  </label>
                ))
              )}
            </div>
          </RadioGroup>
        </div>

        {/* Selected Info */}
        {selectedSectionId && (
          <div className="text-xs text-muted-foreground">
            Selected:{" "}
            <span className="text-blue-600 font-medium">
              {sections.find((s) => s.id === selectedSectionId)?.name}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
