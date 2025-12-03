"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

interface GeofencingFormProps {
  geofencing: boolean;
  onGeofencingChange: (value: boolean) => void;
}

export function GeofencingForm({
  geofencing,
  onGeofencingChange,
}: GeofencingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Geofencing Requirements</CardTitle>
        <CardDescription>
          Specify whether team members must be physically present at the
          location to complete checklists.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="geofencing" className="text-base font-medium">
              Require Location Verification
            </Label>
            <p className="text-sm text-muted-foreground">
              When enabled, users must be within the designated area to access
              and complete checklists.
            </p>
          </div>
          <Switch
            id="geofencing"
            checked={geofencing}
            onCheckedChange={onGeofencingChange}
          />
        </div>

        {/* Geofencing Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-900">
                Important Notes:
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Location services must be enabled on user devices</li>
                <li>
                  • GPS accuracy may vary depending on device and environment
                </li>
                <li>
                  • Consider weather and environmental factors that might affect
                  GPS signals
                </li>
                <li>
                  • Users will need to grant location permissions to the app
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
