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
  active: string;
  type: string;
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
    active: "true",
    type: "cropland",
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
    setFormData((prev) => ({ ...prev, points: JSON.stringify(boundaryPoints) }));
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
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          }));
          if (!formData.points) {
            setFormData((prev) => ({
              ...prev,
              points: JSON.stringify([[position.coords.longitude, position.coords.latitude]]),
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
            description: "Unable to retrieve your current location. Please check permissions.",
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
        active: formData.active === "true",
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

      <div className="px-32">
        <form id="section-form" onSubmit={handleSubmit} className="space-y-6">
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
