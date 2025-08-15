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

interface FarmSectionForm {
  name: string;
  type: "pasture" | "cropland" | "facility" | "water";
  acreage: string;
  status: "active" | "maintenance" | "inactive";
  description: string;
  coordinates: {
    lat: string;
    lng: string;
  };
}

export default function NewSectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FarmSectionForm>({
    name: "",
    type: "cropland",
    acreage: "",
    status: "active",
    description: "",
    coordinates: {
      lat: "",
      lng: "",
    },
  });

  // Debug logging for form data changes
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    console.log("handleInputChange called:", { field, value });

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => {
        const newData = {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof FarmSectionForm] as any),
            [child]: value,
          },
        };
        console.log("Updated form data:", newData);
        return newData;
      });
    } else {
      setFormData((prev) => {
        const newData = {
          ...prev,
          [field]: value,
        };
        console.log("Updated form data:", newData);
        return newData;
      });
    }
  };

  const handleCoordinatesChange = (lat: string, lng: string) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: { lat, lng },
    }));
  };

  // Debug logging for preview boundary data
  console.log("Form data for preview:", {
    lat: formData.coordinates.lat,
    lng: formData.coordinates.lng,
    acreage: formData.acreage,
    type: formData.type,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.acreage) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would call your API to create the section
      // For now, we'll just show success and redirect

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
                  <Label>Section Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pasture">Pasture</SelectItem>
                      <SelectItem value="cropland">Cropland</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acreage">Acreage *</Label>
                  <Input
                    id="acreage"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.acreage}
                    onChange={(e) =>
                      handleInputChange("acreage", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this section..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Coordinates */}
          <Card>
            <CardHeader>
              <CardTitle>Location Coordinates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.000001"
                    placeholder="40.7128"
                    value={formData.coordinates.lat}
                    onChange={(e) =>
                      handleInputChange("coordinates.lat", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.000001"
                    placeholder="-74.0060"
                    value={formData.coordinates.lng}
                    onChange={(e) =>
                      handleInputChange("coordinates.lng", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Maps */}
          {(() => {
            const previewData = {
              lat: formData.coordinates.lat,
              lng: formData.coordinates.lng,
              acreage: formData.acreage,
              type: formData.type,
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
                  coordinates: {
                    lat: "40.724652266271505",
                    lng: "-74.13215257918141",
                  },
                  acreage: "100",
                  type: "cropland" as const,
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
                console.log("Setting just acreage...");
                setFormData((prev) => {
                  const updated = { ...prev, acreage: "150" };
                  console.log("Updated acreage:", updated);
                  return updated;
                });
              }}
              className="mr-2"
            >
              Set Acreage Only
            </Button>
            <div className="mt-2 text-xs text-gray-500">
              <div>
                Current: {formData.coordinates.lat}, {formData.coordinates.lng}
              </div>
              <div>
                Acreage: "{formData.acreage}" (length: {formData.acreage.length}
                )
              </div>
              <div>Type: {formData.type}</div>
            </div>
          </div>

          <MapComponent
            onCoordinatesChange={handleCoordinatesChange}
            initialLat={formData.coordinates.lat}
            initialLng={formData.coordinates.lng}
            previewBoundary={{
              lat: formData.coordinates.lat,
              lng: formData.coordinates.lng,
              acreage: formData.acreage,
              type: formData.type,
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
