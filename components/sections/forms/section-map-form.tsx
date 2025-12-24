import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, Plus, X, MapPin } from "lucide-react";
import { LeafletMap } from "@/components/maps/leaflet-map";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
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

export function SectionMapForm({
  formData,
  initialMapPosition,
  loading,
  onCoordinatesChange,
  onPolygonComplete,
  onCancel,
  existingPoints,
}: SectionMapFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBoundary, setSelectedBoundary] = useState<
    [number, number][] | null
  >(existingPoints || null);

  const handlePolygonComplete = (boundaryPoints: [number, number][]) => {
    onPolygonComplete(boundaryPoints);
    setSelectedBoundary(boundaryPoints);
    setIsDialogOpen(false);
  };

  const FitBounds = ({ boundary }: { boundary: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
      if (boundary.length > 0) {
        const latlngs = boundary.map(
          ([lng, lat]) => [lat, lng] as [number, number]
        );
        const polygon = L.polygon(latlngs);
        map.fitBounds(polygon.getBounds());
      }
    }, [map, boundary]);
    return null;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Area Selection</CardTitle>
          <CardDescription>
            Select the boundaries of your farm section by drawing on the map.
            You can draw polygons, rectangles, or circles to define the area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-[300px]">
                <MapPin className="mr-2 h-4 w-4" />
                Select Area
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Select Area Section</DialogTitle>
              </DialogHeader>
              <LeafletMap
                onCoordinatesChange={onCoordinatesChange}
                onPolygonComplete={handlePolygonComplete}
                initialLat={initialMapPosition.lat}
                initialLng={initialMapPosition.lng}
                previewBoundary={{
                  lat: initialMapPosition.lat,
                  lng: initialMapPosition.lng,
                  acreage: formData.size,
                }}
              />
            </DialogContent>
          </Dialog>

          {selectedBoundary && !isDialogOpen && (
            <>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Selected Area</h4>
                <div
                  className="w-full border rounded-lg relative"
                  style={{ height: "200px", zIndex: 1 }}
                >
                  <MapContainer
                    center={[40.7128, -74.006]}
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url={`https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`}
                      attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                      maxZoom={20}
                    />
                    <Polygon
                      positions={selectedBoundary.map(([lng, lat]) => [
                        lat,
                        lng,
                      ])}
                      color="green"
                      fillColor="lightgreen"
                      fillOpacity={0.3}
                    />
                    <FitBounds boundary={selectedBoundary} />
                  </MapContainer>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
