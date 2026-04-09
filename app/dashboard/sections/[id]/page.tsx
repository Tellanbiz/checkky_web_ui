"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitFarm } from "@/lib/services/sections/post";
import { getAccessToken } from "@/lib/services/auth/auth-get";
import { BasicInfoForm } from "@/components/sections/forms/basic-info-form";
import { SectionMapForm } from "@/components/sections/forms/section-map-form";
import { ClearSectionDialog } from "@/components/sections/forms/clear-section-dialog";
import { Section } from "@/lib/services/sections/models";
import { useSections } from "@/components/sections/use-sections";

interface FarmSectionForm {
  id: string;
  name: string;
  location: string;
  size: string;
  points: string;
}

export default function EditSectionPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [initialMapPosition, setInitialMapPosition] = useState<{
    lat: string;
    lng: string;
  }>({ lat: "", lng: "" });
  const [isSelectingNew, setIsSelectingNew] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [section, setSection] = useState<Section | null>(null);

  const [formData, setFormData] = useState<FarmSectionForm>({
    id: "",
    name: "",
    location: "",
    size: "",
    points: "",
  });

  const { data: sections = [], isLoading: sectionsLoading } = useSections();

  useEffect(() => {
    if (sections.length > 0 && params.id) {
      const foundSection = sections.find((s: Section) => s.id === params.id);
      if (foundSection) {
        setSection(foundSection);
        setFormData({
          id: foundSection.id || "",
          name: foundSection.name || "",
          location: foundSection.location || "",
          size: foundSection.size_ha?.toString() || "",
          points: foundSection.points ? JSON.stringify(foundSection.points) : "",
        });
        
        // Set initial map position if points exist
        if (foundSection.points && foundSection.points.length > 0) {
          const firstPoint = foundSection.points[0];
          setInitialMapPosition({
            lat: firstPoint[1].toString(),
            lng: firstPoint[0].toString(),
          });
        }
      }
    }
  }, [sections, params.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoordinatesChange = (lat: string, lng: string) => {
    setInitialMapPosition({ lat, lng });
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
          const j = ( i + 1 ) % points.length;
          area += points[i][0] * points[j][1];
          area -= points[j][0] * points[i][1];
        }
        area = Math.abs(area) / 2;

        // Convert from square degrees to square meters
        // Approximate: 1 degree ≈ 111,320 meters (at equator)
        const avgLatRad = ( avgLat * Math.PI ) / 180;
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
    setIsSubmitting(true);
    try {
      // Simulate progress steps for section update
      const progressSteps = [
        { progress: 20, delay: 300 },
        { progress: 40, delay: 500 },
        { progress: 60, delay: 400 },
        { progress: 80, delay: 300 },
        { progress: 95, delay: 200 },
      ];

      // Execute progress steps
      for (const step of progressSteps) {
        await new Promise(resolve => {
          setTimeout(() => {
            setUploadProgress(step.progress);
            resolve(undefined);
          }, step.delay);
        });
      }

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
        id: formData.id,
        name: formData.name,
        location: formData.location,
        size_ha: Number(formData.size),
        points: parsedPoints,
        active: true,
      };
      
      await submitFarm(farmParams);
      
      // Complete progress
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 200));

      toast({
        title: "Section Updated Successfully!",
        description: `Section "${formData.name}" has been updated successfully.`,
      });
      router.push("/dashboard/sections");
    } catch (error) {
      console.error("Failed to update section:", error);
      toast({
        title: "Error",
        description: "Failed to update section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sectionsLoading) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">Section not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      {/* Page Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Edit Section
              </h1>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.size}
              className="px-4 py-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Section
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar - Show only when submitting */}
      {isSubmitting && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Updating section...</span>
                <span className="text-gray-900 font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            onGetCurrentLocation={getCurrentLocation}
          />

          <SectionMapForm
            formData={formData}
            initialMapPosition={initialMapPosition}
            loading={isSubmitting}
            onCoordinatesChange={handleCoordinatesChange}
            onPolygonComplete={handlePolygonComplete}
            onCancel={() => router.push("/dashboard/sections")}
            existingPoints={section?.points}
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
