"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MapComponent } from "@/components/maps/map";
import { submitSection } from "@/lib/services/sections/actions";

interface FarmSectionForm {
  name: string;
  location: string;
  country: string;
  size: string;
  points: string;
  active: string;
}

export default function NewSectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FarmSectionForm>({
    name: "",
    location: "",
    country: "",
    size: "",
    points: "",
    active: "true",
  });

  // Debug logging for form data changes
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    console.log("handleInputChange called:", { field, value });

    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("Updated form data:", newData);
      return newData;
    });
  };

  const handleCoordinatesChange = (lat: string, lng: string) => {
    // This function is called when coordinates change, but for polygon boundaries
    // we need to get the complete drawn boundary from the map component
    // For now, we'll store a single point but the map should provide the full polygon
    const newPoint: [number, number] = [Number(lng), Number(lat)];

    setFormData((prev) => ({
      ...prev,
      points: JSON.stringify([newPoint]),
    }));
  };

  // Function to get the complete polygon boundary from the map
  const getPolygonBoundary = () => {
    // This should be called after the polygon is drawn to get all boundary points
    // The MapComponent already has drawnBoundaryPoints that we need to access
    console.log("Need to get complete polygon boundary from map");
  };

  // Handle complete polygon boundary from map
  const handlePolygonComplete = (boundaryPoints: [number, number][]) => {
    console.log("Received complete polygon boundary:", boundaryPoints);
    setFormData((prev) => ({
      ...prev,
      points: JSON.stringify(boundaryPoints),
    }));
  };

  // Debug logging for preview boundary data
  console.log("Form data for preview:", {
    points: formData.points,
    size: formData.size,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.size) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Parse points from string to [number, number][] format
      let parsedPoints: [number, number][] = [];
      if (formData.points) {
        try {
          const pointsArray = JSON.parse(formData.points);
          if (Array.isArray(pointsArray) && pointsArray.length > 0) {
            parsedPoints = pointsArray;
          }
        } catch (error) {
          console.error("Failed to parse points:", error);
        }
      }

      const farmParams = {
        name: formData.name,
        location: formData.location,
        size_ha: Number(formData.size),
        points: parsedPoints,
        active: formData.active === "true",
      };

      await submitSection(farmParams);

      toast({
        title: "Section Created",
        description: `Section "${formData.name}" has been created successfully.`,
      });

      // Redirect back to sections page
      router.push("/dashboard/sections");
    } catch (error) {
      console.error("Failed to create section:", error);
      toast({
        title: "Error",
        description: "Failed to create section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b px-8 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Add New Section</h1>
        <Button type="submit" form="section-form" disabled={loading}>
          {loading ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Section
            </>
          )}
        </Button>
      </div>

      <div className="px-8">
        <form id="section-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Section Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter section name..."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Enter location..."
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size (hectares) *</Label>
                  <Input
                    id="size"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={formData.active}
                    onValueChange={(value) =>
                      handleInputChange("active", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Maps */}
          {(() => {
            const previewData = {
              lat: formData.points
                ? JSON.parse(formData.points)[0]?.[1] || ""
                : "",
              lng: formData.points
                ? JSON.parse(formData.points)[0]?.[0] || ""
                : "",
              acreage: formData.size,
              type: "cropland" as const,
            };
            console.log("Passing preview data to MapComponent:", previewData);
            return null;
          })()}

          <MapComponent
            onCoordinatesChange={handleCoordinatesChange}
            onPolygonComplete={handlePolygonComplete}
            initialLat={
              formData.points ? JSON.parse(formData.points)[0]?.[1] || "" : ""
            }
            initialLng={
              formData.points ? JSON.parse(formData.points)[0]?.[0] || "" : ""
            }
            previewBoundary={{
              lat: formData.points
                ? JSON.parse(formData.points)[0]?.[1] || ""
                : "",
              lng: formData.points
                ? JSON.parse(formData.points)[0]?.[0] || ""
                : "",
              acreage: formData.size,
              type: "cropland" as const,
            }}
          />

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/sections")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
