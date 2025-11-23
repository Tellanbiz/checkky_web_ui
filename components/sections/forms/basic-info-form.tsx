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
import { MapPin } from "lucide-react";

interface FarmSectionForm {
  name: string;
  location: string;
  size: string;
  points: string;
}

interface BasicInfoFormProps {
  formData: FarmSectionForm;
  onInputChange: (field: string, value: string) => void;
  onGetCurrentLocation: () => void;
}

export function BasicInfoForm({
  formData,
  onInputChange,
  onGetCurrentLocation,
}: BasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Section Name *</Label>
            <Input
              id="name"
              placeholder="Enter section name..."
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter a unique name for this farm section.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              {formData.location ? "Selected Farm Area" : "Farm Area *"}
            </Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Select farm area from map..."
                value={formData.location}
                readOnly
                disabled
                className={`bg-gray-50 cursor-not-allowed ${
                  formData.location
                    ? "bg-green-50 border-green-200 text-green-900"
                    : "text-gray-500"
                }`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onGetCurrentLocation}
                className="shrink-0"
                title="Get current GPS location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {formData.location
                ? `Selected: ${formData.location}`
                : "Select a farm area from the map to populate this field automatically."}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size (hectares) *</Label>
            <Input
              id="size"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={formData.size}
              onChange={(e) => onInputChange("size", e.target.value)}
              required
              readOnly
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Enter the area size in hectares.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
