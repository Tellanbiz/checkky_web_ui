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
  active: string;
  type: string;
}

interface BasicInfoFormProps {
  formData: FarmSectionForm;
  onInputChange: (field: string, value: string) => void;
  onGetCurrentLocation: () => void;
}

export function BasicInfoForm({ formData, onInputChange, onGetCurrentLocation }: BasicInfoFormProps) {
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
            <Label htmlFor="location">Location *</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter location..."
                value={formData.location}
                onChange={(e) => onInputChange("location", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onGetCurrentLocation}
                className="shrink-0"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Specify the location or use GPS to get current position.
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
            />
            <p className="text-sm text-muted-foreground">
              Enter the area size in hectares.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Section Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => onInputChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cropland">Cropland</SelectItem>
                <SelectItem value="pasture">Pasture</SelectItem>
                <SelectItem value="facility">Facility</SelectItem>
                <SelectItem value="water">Water</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose the type of land use for this section.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Status *</Label>
            <Select
              value={formData.active}
              onValueChange={(value) => onInputChange("active", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Set the section as active or inactive.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
