import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  onCoordinatesChange: (lat: string, lng: string) => void;
  onPolygonComplete?: (boundaryPoints: [number, number][]) => void;
  initialLat?: string;
  initialLng?: string;
  previewBoundary?: {
    lat: string;
    lng: string;
    acreage: string;
    type: string;
  };
}

function MapController({ initialLat, initialLng, onCoordinatesChange }: { initialLat?: string; initialLng?: string; onCoordinatesChange: (lat: string, lng: string) => void }) {
  const map = useMap();

  useEffect(() => {
    if (initialLat && initialLng) {
      map.setView([parseFloat(initialLat), parseFloat(initialLng)], 13);
    }
  }, [map, initialLat, initialLng]);

  useMapEvents({
    click: (e) => {
      onCoordinatesChange(e.latlng.lat.toString(), e.latlng.lng.toString());
    },
  });

  return null;
}

export function LeafletMap({
  onCoordinatesChange,
  onPolygonComplete,
  initialLat,
  initialLng,
  previewBoundary,
}: LeafletMapProps) {
  const [drawnItems, setDrawnItems] = useState<L.FeatureGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleCreated = (e: any) => {
    const { layerType, layer } = e;
    const fg = drawnItems;
    if (fg) {
      fg.clearLayers(); // Clear previous shapes
      fg.addLayer(layer);
    }

    let boundaryPoints: [number, number][] = [];

    if (layerType === 'polygon') {
      const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
      boundaryPoints = latlngs.map(latlng => [latlng.lng, latlng.lat]);
    } else if (layerType === 'rectangle') {
      const bounds = (layer as L.Rectangle).getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      boundaryPoints = [
        [sw.lng, sw.lat], // bottom-left
        [ne.lng, sw.lat], // bottom-right
        [ne.lng, ne.lat], // top-right
        [sw.lng, ne.lat], // top-left
      ];
    } else if (layerType === 'circle') {
      const center = (layer as L.Circle).getLatLng();
      const radius = (layer as L.Circle).getRadius();
      // Approximate circle with 8 points
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const lat = center.lat + (radius / 111000) * Math.cos(angle);
        const lng = center.lng + (radius / 111000) * Math.sin(angle);
        boundaryPoints.push([lng, lat]);
      }
    }

    if (onPolygonComplete && boundaryPoints.length > 0) {
      onPolygonComplete(boundaryPoints);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const results = await response.json();
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);
      onCoordinatesChange(lat.toString(), lng.toString());
    }
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-2">
        <div className="relative">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="font-medium text-gray-900">
                    {result.display_name}
                  </div>
                  {result.type && (
                    <div className="text-sm text-gray-500 capitalize">
                      {result.type.replace(/_/g, " ")}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-2">How to use the map:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use the drawing tools to create farm boundaries (polygon, rectangle, circle)</li>
            <li>Only one shape at a time; drawing a new one replaces the previous</li>
            <li>Coordinates update automatically when you draw a shape</li>
          </ul>
        </div>
      </div>

      <div
        className="w-full border-2 border-gray-300 rounded-lg bg-gray-100 shadow-lg"
        style={{ height: "600px", minHeight: "600px" }}
      >
        <MapContainer
          center={initialLat && initialLng ? [parseFloat(initialLat), parseFloat(initialLng)] : [40.7128, -74.006]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url={`https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`}
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            maxZoom={20}
          />
          <MapController initialLat={initialLat} initialLng={initialLng} onCoordinatesChange={onCoordinatesChange} />
          <FeatureGroup
            ref={(ref: L.FeatureGroup | null) => {
              if (ref && !drawnItems) {
                setDrawnItems(ref);
              }
            }}
          >
            <EditControl
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: true,
                polygon: true,
                circle: true,
                marker: false,
                polyline: false,
                circlemarker: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
    </div>
  );
}
