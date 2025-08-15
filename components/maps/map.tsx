"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Trash2, Search, Navigation, X } from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

interface MapComponentProps {
  onCoordinatesChange: (lat: string, lng: string) => void;
  initialLat?: string;
  initialLng?: string;
  previewBoundary?: {
    lat: string;
    lng: string;
    acreage: string;
    type: string;
  };
}

export function MapComponent({
  onCoordinatesChange,
  initialLat,
  initialLng,
  previewBoundary,
}: MapComponentProps) {
  const [map, setMap] = useState<any>(null);
  const [drawingManager, setDrawingManager] = useState<any>(null);
  const [drawnShapes, setDrawnShapes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [geocoder, setGeocoder] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchMarkers, setSearchMarkers] = useState<any[]>([]);
  const [previewShape, setPreviewShape] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && mapRef.current) {
        const initialCenter = {
          lat: initialLat ? parseFloat(initialLat) : 40.7128,
          lng: initialLng ? parseFloat(initialLng) : -74.006,
        };

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: 12,
          mapTypeId: window.google.maps.MapTypeId.SATELLITE,
          styles: [
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ visibility: "simplified" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ visibility: "simplified" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ visibility: "simplified" }],
            },
          ],
        });

        const drawingManagerInstance =
          new window.google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                window.google.maps.drawing.OverlayType.POLYGON,
                window.google.maps.drawing.OverlayType.RECTANGLE,
                window.google.maps.drawing.OverlayType.CIRCLE,
              ],
            },
            polygonOptions: {
              fillColor: "#10B981",
              fillOpacity: 0.3,
              strokeColor: "#059669",
              strokeWeight: 3,
            },
            rectangleOptions: {
              fillColor: "#10B981",
              fillOpacity: 0.3,
              strokeColor: "#059669",
              strokeWeight: 3,
            },
            circleOptions: {
              fillColor: "#10B981",
              fillOpacity: 0.3,
              strokeColor: "#059669",
              strokeWeight: 3,
            },
          });

        drawingManagerInstance.setMap(mapInstance);

        // Listen for shape completion
        window.google.maps.event.addListener(
          drawingManagerInstance,
          "polygoncomplete",
          (polygon: any) => {
            // Clear previous shapes
            drawnShapes.forEach((shape) => {
              shape.setMap(null);
            });
            setDrawnShapes([polygon]);
            updateCoordinatesFromShape(polygon);
          }
        );

        window.google.maps.event.addListener(
          drawingManagerInstance,
          "rectanglecomplete",
          (rectangle: any) => {
            // Clear previous shapes
            drawnShapes.forEach((shape) => {
              shape.setMap(null);
            });
            setDrawnShapes([rectangle]);
            updateCoordinatesFromShape(rectangle);
          }
        );

        window.google.maps.event.addListener(
          drawingManagerInstance,
          "circlecomplete",
          (circle: any) => {
            // Clear previous shapes
            drawnShapes.forEach((shape) => {
              shape.setMap(null);
            });
            setDrawnShapes([circle]);
            updateCoordinatesFromShape(circle);
          }
        );

        // Initialize geocoder
        const geocoderInstance = new window.google.maps.Geocoder();
        setGeocoder(geocoderInstance);

        setMap(mapInstance);
        setDrawingManager(drawingManagerInstance);
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}&libraries=drawing,geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleMaps;
      document.head.appendChild(script);
    } else {
      loadGoogleMaps();
    }

    return () => {
      if (map) {
        window.google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [initialLat, initialLng]);

  // Watch for previewBoundary changes and create preview shape
  useEffect(() => {
    console.log("previewBoundary changed:", previewBoundary);
    console.log("previewBoundary details:", {
      lat: previewBoundary?.lat,
      lng: previewBoundary?.lng,
      acreage: previewBoundary?.acreage,
      type: previewBoundary?.type,
      latType: typeof previewBoundary?.lat,
      lngType: typeof previewBoundary?.lng,
      acreageType: typeof previewBoundary?.acreage,
      typeType: typeof previewBoundary?.type,
      latLength: previewBoundary?.lat?.length,
      lngLength: previewBoundary?.lng?.length,
      acreageLength: previewBoundary?.acreage?.length,
    });

    if (
      map &&
      previewBoundary?.lat &&
      previewBoundary?.lng &&
      previewBoundary?.acreage
    ) {
      console.log("Creating preview boundary:", previewBoundary);
      createPreviewBoundary();
    } else {
      console.log("Cannot create preview - missing data:", {
        hasMap: !!map,
        hasLat: !!previewBoundary?.lat,
        hasLng: !!previewBoundary?.lng,
        hasAcreage: !!previewBoundary?.acreage,
      });
    }
  }, [
    map,
    previewBoundary?.lat,
    previewBoundary?.lng,
    previewBoundary?.acreage,
  ]);

  const updateCoordinatesFromShape = (shape: any) => {
    let bounds: any;
    if (shape instanceof window.google.maps.Polygon) {
      bounds = new window.google.maps.LatLngBounds();
      shape.getPath().forEach((latLng: any) => {
        bounds.extend(latLng);
      });
    } else if (shape instanceof window.google.maps.Rectangle) {
      bounds = shape.getBounds();
    } else if (shape instanceof window.google.maps.Circle) {
      const center = shape.getCenter();
      const radius = shape.getRadius();
      bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(
          center.lat() - radius / 111000,
          center.lng() - radius / 111000
        ),
        new window.google.maps.LatLng(
          center.lat() + radius / 111000,
          center.lng() + radius / 111000
        )
      );
    }

    if (bounds) {
      const center = bounds.getCenter();
      onCoordinatesChange(center.lat().toString(), center.lng().toString());
    }
  };

  const clearDrawnShapes = () => {
    drawnShapes.forEach((shape) => {
      shape.setMap(null);
    });
    setDrawnShapes([]);

    // Also clear preview shape
    if (previewShape) {
      previewShape.setMap(null);
      setPreviewShape(null);
    }
  };

  const handleSearch = async () => {
    if (!geocoder || !searchQuery.trim()) return;

    try {
      geocoder.geocode(
        { address: searchQuery },
        (results: any, status: any) => {
          if (status === "OK" && results.length > 0) {
            setSearchResults(results);
            setShowSearchResults(true);
          } else {
            setSearchResults([]);
            setShowSearchResults(false);
          }
        }
      );
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const selectSearchResult = (result: any) => {
    const location = result.geometry.location;
    map.setCenter(location);
    map.setZoom(15);

    // Add a marker for the selected location (but don't clear existing shapes)
    const marker = new window.google.maps.Marker({
      map: map,
      position: location,
      title: result.formatted_address,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(32, 32),
      },
    });

    // Track the marker for later removal
    setSearchMarkers((prev) => [...prev, marker]);

    // Update coordinates without affecting drawn shapes
    onCoordinatesChange(location.lat().toString(), location.lng().toString());

    setSearchQuery(result.formatted_address);
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(pos);
          map.setZoom(15);

          // Add a marker for current location (but don't clear existing shapes)
          const marker = new window.google.maps.Marker({
            map: map,
            position: pos,
            title: "Current Location",
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });

          // Track the marker for later removal
          setSearchMarkers((prev) => [...prev, marker]);

          // Update coordinates without affecting drawn shapes
          onCoordinatesChange(pos.lat.toString(), pos.lng.toString());
          setCurrentLocation(pos);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  const clearSearchMarkers = () => {
    searchMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    setSearchMarkers([]);
  };

  const createPreviewBoundary = () => {
    console.log("createPreviewBoundary called with:", { map, previewBoundary });

    if (
      !map ||
      !previewBoundary?.lat ||
      !previewBoundary?.lng ||
      !previewBoundary?.acreage
    ) {
      console.log("Missing required data for preview");
      return;
    }

    // Clear previous preview
    if (previewShape) {
      previewShape.setMap(null);
    }

    const lat = parseFloat(previewBoundary.lat);
    const lng = parseFloat(previewBoundary.lng);
    const acreage = parseFloat(previewBoundary.acreage);

    console.log("Creating preview with:", { lat, lng, acreage });

    // Convert acres to approximate radius in degrees
    // 1 acre ≈ 0.0015625 square miles
    // 1 square mile ≈ 0.01 degrees (approximate)
    // Make the preview larger for better visibility
    const radiusInDegrees = Math.sqrt(acreage * 0.0015625 * 0.01) * 2;

    console.log("Calculated radius in degrees:", radiusInDegrees);

    let shape;
    if (previewBoundary.type === "rectangle") {
      shape = new window.google.maps.Rectangle({
        map: map,
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(
            lat - radiusInDegrees,
            lng - radiusInDegrees
          ),
          new window.google.maps.LatLng(
            lat + radiusInDegrees,
            lng + radiusInDegrees
          )
        ),
        fillColor: "#FEF3C7",
        fillOpacity: 0.5,
        strokeColor: "#F59E0B",
        strokeWeight: 3,
        strokeOpacity: 1,
      });
    } else {
      // Default to circle for other types
      shape = new window.google.maps.Circle({
        map: map,
        center: { lat, lng },
        radius: radiusInDegrees * 111000, // Convert to meters
        fillColor: "#FEF3C7",
        fillOpacity: 0.5,
        strokeColor: "#F59E0B",
        strokeWeight: 3,
        strokeOpacity: 1,
      });
    }

    setPreviewShape(shape);
    console.log("Preview shape created:", shape);

    // DON'T fit map bounds - this was causing the refresh!
    // Just add the preview shape without moving the map
    // This keeps the user's drawn boundary visible where they drew it
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Map Drawing & Location
          </span>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearDrawnShapes}
              disabled={drawnShapes.length === 0}
              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Shapes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSearchMarkers}
              disabled={searchMarkers.length === 0}
              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Search Markers
            </Button>
            {previewBoundary && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={createPreviewBoundary}
                className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Preview Boundary
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={createPreviewBoundary}
              disabled={
                !previewBoundary?.lat ||
                !previewBoundary?.lng ||
                !previewBoundary?.acreage
              }
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Force Preview
            </Button>
            {previewShape && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (previewShape instanceof window.google.maps.Rectangle) {
                    map.fitBounds(previewShape.getBounds());
                  } else if (
                    previewShape instanceof window.google.maps.Circle
                  ) {
                    const center = previewShape.getCenter();
                    const radius = previewShape.getRadius();
                    const bounds = new window.google.maps.LatLngBounds();
                    bounds.extend({
                      lat: center.lat() - radius / 111000,
                      lng: center.lng() - radius / 111000,
                    });
                    bounds.extend({
                      lat: center.lat() + radius / 111000,
                      lng: center.lng() + radius / 111000,
                    });
                    map.fitBounds(bounds);
                  }
                }}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Center on Preview
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Location Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="map-search">Search Location</Label>
              <div className="relative">
                <div className="flex space-x-2">
                  <Input
                    id="map-search"
                    ref={searchInputRef}
                    placeholder="Enter address, city, or landmark..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSearchResult(result)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="font-medium text-gray-900">
                          {result.formatted_address}
                        </div>
                        {result.types && result.types.length > 0 && (
                          <div className="text-sm text-gray-500 capitalize">
                            {result.types[0].replace(/_/g, " ")}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current Location</Label>
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get My Location
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">How to use the map:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Search:</strong> Enter an address to find and center
                  the map
                </li>
                <li>
                  <strong>Current Location:</strong> Click to center the map on
                  your current position
                </li>
                <li>
                  <strong>Drawing Tools:</strong> Use the tools above the map to
                  draw farm boundaries (only one shape at a time)
                </li>
                <li>
                  <strong>Auto-update:</strong> Coordinates automatically update
                  when you draw a shape
                </li>
              </ul>
            </div>
          </div>

          {/* Map Container */}
          <div
            ref={mapRef}
            className="w-full border-2 border-gray-300 rounded-lg bg-gray-100 shadow-lg"
            style={{ height: "600px", minHeight: "600px" }}
          />

          {/* Status Information */}
          <div className="flex items-center justify-between text-sm">
            {drawnShapes.length > 0 && (
              <div className="text-green-600 font-medium">
                <MapPin className="inline h-4 w-4 mr-1" />
                Farm boundary drawn
              </div>
            )}
            {currentLocation && (
              <div className="text-blue-600">
                <Navigation className="inline h-4 w-4 mr-2" />
                Current location: {currentLocation.lat.toFixed(6)},{" "}
                {currentLocation.lng.toFixed(6)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
