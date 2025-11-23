"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitSection } from "@/lib/services/sections/actions";
import { BasicInfoForm } from "@/components/sections/forms/basic-info-form";
import { SectionMapForm } from "@/components/sections/forms/section-map-form";
import { ClearSectionDialog } from "@/components/sections/forms/clear-section-dialog";

interface FarmSectionForm {
  name: string;
  location: string;
  size: string;
  points: string;
}

export default function NewSectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialMapPosition, setInitialMapPosition] = useState<{
    lat: string;
    lng: string;
  }>({ lat: "", lng: "" });
  const [isSelectingNew, setIsSelectingNew] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const [formData, setFormData] = useState<FarmSectionForm>({
    name: "",
    location: "",
    size: "",
    points: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoordinatesChange = (lat: string, lng: string) => {
    if (!isSelectingNew && formData.points) {
      setShowClearDialog(true);
      return;
    }
    if (!isSelectingNew) setIsSelectingNew(true);
  };

  const handleConfirmClear = () => {
    setFormData((prev) => ({ ...prev, points: "" }));
    setIsSelectingNew(true);
    setShowClearDialog(false);
  };

  const handleCancelClear = () => {
    setShowClearDialog(false);
  };

  const handlePolygonComplete = (boundaryPoints: [number, number][]) => {
    // Calculate center point for location name
    if (boundaryPoints.length > 0) {
      const avgLat =
        boundaryPoints.reduce((sum, point) => sum + point[1], 0) /
        boundaryPoints.length;
      const avgLng =
        boundaryPoints.reduce((sum, point) => sum + point[0], 0) /
        boundaryPoints.length;

      // Calculate area in hectares from polygon coordinates
      const calculateArea = (points: [number, number][]) => {
        // Using the Shoelace formula to calculate polygon area
        let area = 0;
        for (let i = 0; i < points.length; i++) {
          const j = (i + 1) % points.length;
          area += points[i][0] * points[j][1];
          area -= points[j][0] * points[i][1];
        }
        area = Math.abs(area) / 2;

        // Convert from square degrees to square meters
        // Approximate: 1 degree ≈ 111,320 meters (at equator)
        const avgLatRad = (avgLat * Math.PI) / 180;
        const metersPerDegreeLat = 111320;
        const metersPerDegreeLng = 111320 * Math.cos(avgLatRad);

        const areaInSquareMeters =
          area * metersPerDegreeLat * metersPerDegreeLng;

        // Convert to hectares (1 hectare = 10,000 square meters)
        const areaInHectares = areaInSquareMeters / 10000;

        return areaInHectares;
      };

      const calculatedArea = calculateArea(boundaryPoints);

      // Use reverse geocoding to get the address
      const getAddressFromCoordinates = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${avgLat}&lon=${avgLng}`
          );
          const data = await response.json();

          // Extract address components
          const address = data.address;
          let locationName = "Unknown Location";

          if (address) {
            // Try to build a meaningful address
            const parts = [];
            if (address.county) parts.push(address.county);
            if (address.state) parts.push(address.state);
            if (address.country) parts.push(address.country);

            locationName =
              parts.length > 0
                ? parts.join(", ")
                : data.name || "Unknown Location";
          }

          setFormData((prev) => ({
            ...prev,
            points: JSON.stringify(boundaryPoints),
            location: locationName,
            size: calculatedArea.toFixed(2), // Auto-set calculated area
          }));
        } catch (error) {
          console.error("Failed to get address:", error);
          // Fallback to coordinates if geocoding fails
          setFormData((prev) => ({
            ...prev,
            points: JSON.stringify(boundaryPoints),
            location: `${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}`,
            size: calculatedArea.toFixed(2), // Auto-set calculated area
          }));
        }
      };

      getAddressFromCoordinates();
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const lng = position.coords.longitude.toString();
          setInitialMapPosition({ lat, lng });
          setFormData((prev) => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(
              6
            )}, ${position.coords.longitude.toFixed(6)}`,
          }));
          if (!formData.points) {
            setFormData((prev) => ({
              ...prev,
              points: JSON.stringify([
                [position.coords.longitude, position.coords.latitude],
              ]),
            }));
          }
          toast({
            title: "Location Retrieved",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description:
              "Unable to retrieve your current location. Please check permissions.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

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
      };
      await submitSection(farmParams);
      toast({
        title: "Section Created",
        description: `Section "${formData.name}" has been created successfully.`,
      });
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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b px-12 py-6 flex justify-between items-center bg-gradient-to-r from-white ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Add New Section
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create a new farm section with detailed information
          </p>
        </div>
        <Button
          type="submit"
          form="section-form"
          disabled={loading}
          className="px-6 py-2"
        >
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

      <div className="px-16 py-8">
        <form
          id="section-form"
          onSubmit={handleSubmit}
          className="space-y-8 max-w-6xl mx-auto"
        >
          <BasicInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            onGetCurrentLocation={getCurrentLocation}
          />

          <SectionMapForm
            formData={formData}
            initialMapPosition={initialMapPosition}
            loading={loading}
            onCoordinatesChange={handleCoordinatesChange}
            onPolygonComplete={handlePolygonComplete}
            onCancel={() => router.push("/dashboard/sections")}
          />
        </form>
      </div>

      <ClearSectionDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />
    </div>
  );
}
