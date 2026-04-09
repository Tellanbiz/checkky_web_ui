"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Crosshair, CircleDot } from "lucide-react";
import { LeafletMap } from "@/components/maps/leaflet-map";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

interface FarmSectionForm {
  name: string;
  location: string;
  size: string;
  points: string;
}

interface SectionMapFormProps {
  formData: FarmSectionForm;
  initialMapPosition: {
    lat: string;
    lng: string;
  };
  loading: boolean;
  onCoordinatesChange: (lat: string, lng: string) => void;
  onPolygonComplete: (boundaryPoints: [number, number][]) => void;
  onCancel: () => void;
  existingPoints?: [number, number][];
}

function buildCirclePoints(
  centerLat: number,
  centerLng: number,
  radiusMeters: number,
  segments = 24,
): [number, number][] {
  const earthRadius = 6378137;
  const points: [number, number][] = [];
  const latRadians = (centerLat * Math.PI) / 180;

  for (let index = 0; index < segments; index += 1) {
    const angle = (2 * Math.PI * index) / segments;
    const latOffset = (radiusMeters / earthRadius) * Math.cos(angle);
    const lngOffset =
      (radiusMeters / (earthRadius * Math.cos(latRadians))) * Math.sin(angle);

    points.push([
      centerLng + (lngOffset * 180) / Math.PI,
      centerLat + (latOffset * 180) / Math.PI,
    ]);
  }

  return points;
}

function FitBounds({ boundary }: { boundary: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (boundary.length === 0) {
      return;
    }

    const latLngs = boundary.map(
      ([lng, lat]) => [lat, lng] as [number, number],
    );
    const polygon = L.polygon(latLngs);
    map.fitBounds(polygon.getBounds(), { padding: [20, 20] });
  }, [boundary, map]);

  return null;
}

export function SectionMapForm({
  formData,
  initialMapPosition,
  loading,
  onCoordinatesChange,
  onPolygonComplete,
  existingPoints,
}: SectionMapFormProps) {
  const [selectedBoundary, setSelectedBoundary] = useState<
    [number, number][] | null
  >(existingPoints || null);
  const [centerLat, setCenterLat] = useState(initialMapPosition.lat);
  const [centerLng, setCenterLng] = useState(initialMapPosition.lng);
  const [radiusMeters, setRadiusMeters] = useState("");

  useEffect(() => {
    setSelectedBoundary(existingPoints || null);
  }, [existingPoints]);

  useEffect(() => {
    if (initialMapPosition.lat) {
      setCenterLat(initialMapPosition.lat);
    }
    if (initialMapPosition.lng) {
      setCenterLng(initialMapPosition.lng);
    }
  }, [initialMapPosition.lat, initialMapPosition.lng]);

  const handleMapCoordinatesChange = (lat: string, lng: string) => {
    setCenterLat(lat);
    setCenterLng(lng);
    onCoordinatesChange(lat, lng);
  };

  const handleBoundaryComplete = (boundaryPoints: [number, number][]) => {
    setSelectedBoundary(boundaryPoints);
    onPolygonComplete(boundaryPoints);
  };

  const handleCreateCircle = () => {
    if (formData.points && existingPoints && existingPoints.length > 0) {
      onCoordinatesChange(centerLat, centerLng);
      return;
    }

    const parsedLat = Number.parseFloat(centerLat);
    const parsedLng = Number.parseFloat(centerLng);
    const parsedRadius = Number.parseFloat(radiusMeters);

    if (
      Number.isNaN(parsedLat) ||
      Number.isNaN(parsedLng) ||
      Number.isNaN(parsedRadius) ||
      parsedRadius <= 0
    ) {
      return;
    }

    const circlePoints = buildCirclePoints(parsedLat, parsedLng, parsedRadius);
    handleBoundaryComplete(circlePoints);
  };

  const boundarySummary = useMemo(() => {
    if (!selectedBoundary || selectedBoundary.length === 0) {
      return "No area selected yet";
    }
    return `${selectedBoundary.length} boundary points saved`;
  }, [selectedBoundary]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Selection</CardTitle>
        <CardDescription>
          Pick the section center and either draw the exact boundary or generate
          a circular area from a radius in meters. Use drawing for irregular
          spaces and the radius flow for quick geofencing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-medium">How this works</p>
          <ul className="mt-2 space-y-1">
            <li>Search or click on the map to set the center point.</li>
            <li>Enter a radius in meters to generate a circular area instantly.</li>
            <li>Use the map drawing tools if you need a custom outline instead.</li>
          </ul>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="center-lat">Center latitude</Label>
            <Input
              id="center-lat"
              value={centerLat}
              onChange={(event) => setCenterLat(event.target.value)}
              placeholder="-1.286389"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="center-lng">Center longitude</Label>
            <Input
              id="center-lng"
              value={centerLng}
              onChange={(event) => setCenterLng(event.target.value)}
              placeholder="36.817223"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="radius-meters">Radius in meters</Label>
            <Input
              id="radius-meters"
              type="number"
              min="1"
              value={radiusMeters}
              onChange={(event) => setRadiusMeters(event.target.value)}
              placeholder="150"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCreateCircle}
            disabled={loading || !centerLat || !centerLng || !radiusMeters}
          >
            <CircleDot className="mr-2 h-4 w-4" />
            Create circle from meters
          </Button>
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
            <Crosshair className="mr-2 h-4 w-4 text-gray-500" />
            {centerLat && centerLng
              ? `Center: ${Number.parseFloat(centerLat).toFixed(5)}, ${Number.parseFloat(centerLng).toFixed(5)}`
              : "Set a center point from the map or inputs"}
          </div>
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
            {boundarySummary}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <LeafletMap
            onCoordinatesChange={handleMapCoordinatesChange}
            onPolygonComplete={handleBoundaryComplete}
            initialLat={centerLat || initialMapPosition.lat}
            initialLng={centerLng || initialMapPosition.lng}
          />
        </div>

        {selectedBoundary && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Saved area preview</h4>
              <p className="text-sm text-muted-foreground">
                This reflects the current area that will be stored for the
                section.
              </p>
            </div>
            <div
              className="w-full overflow-hidden rounded-xl border border-gray-200"
              style={{ height: "240px" }}
            >
              <MapContainer
                center={
                  selectedBoundary.length > 0
                    ? [selectedBoundary[0][1], selectedBoundary[0][0]]
                    : [0, 0]
                }
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url={`https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`}
                  attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                  maxZoom={20}
                />
                <Polygon
                  positions={selectedBoundary.map(([lng, lat]) => [lat, lng])}
                  color="#16A34A"
                  fillColor="#86EFAC"
                  fillOpacity={0.35}
                />
                <FitBounds boundary={selectedBoundary} />
              </MapContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
