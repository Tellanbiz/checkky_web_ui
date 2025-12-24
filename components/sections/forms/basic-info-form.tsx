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
              Enter a unique name for this section.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
