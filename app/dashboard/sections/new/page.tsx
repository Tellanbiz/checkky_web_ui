"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { createFarm } from "@/lib/services/farms/actions";

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
    // Convert coordinates to points format for database
    const points = `[[${lng},${lat}]]`;
    setFormData((prev) => ({
      ...prev,
      points: points,
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
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("location", formData.location);
      formDataToSubmit.append("country", formData.country);
      formDataToSubmit.append("size", formData.size);
      formDataToSubmit.append("points", formData.points);
      formDataToSubmit.append("active", formData.active);

      await createFarm(formDataToSubmit);

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
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="Enter country..."
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
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

          {/* Points */}
          <Card>
            <CardHeader>
              <CardTitle>Location Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points (JSON format)</Label>
                <Input
                  id="points"
                  placeholder="[[lng,lat]]"
                  value={formData.points}
                  onChange={(e) => handleInputChange("points", e.target.value)}
                />
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

          {/* Debug Test Button */}
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Debug: Test Preview Boundary
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Setting test data...");
                const newData = {
                  points: "[[-74.13215257918141,40.724652266271505]]",
                  size: "100",
                };
                console.log("New data to set:", newData);
                setFormData((prev) => {
                  const updated = {
                    ...prev,
                    ...newData,
                  };
                  console.log("Updated form data:", updated);
                  return updated;
                });
              }}
              className="mr-2"
            >
              Set Test Data
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Setting just size...");
                setFormData((prev) => {
                  const updated = { ...prev, size: "150" };
                  console.log("Updated size:", updated);
                  return updated;
                });
              }}
              className="mr-2"
            >
              Set Size Only
            </Button>
            <div className="mt-2 text-xs text-gray-500">
              <div>Current Points: {formData.points}</div>
              <div>
                Size: "{formData.size}" (length: {formData.size.length})
              </div>
            </div>
          </div>

          <MapComponent
            onCoordinatesChange={handleCoordinatesChange}
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
