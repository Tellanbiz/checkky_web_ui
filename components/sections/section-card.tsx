import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface SectionCardProps {
  section: any; // Using any for now, should be properly typed
  onViewDetails: (section: any) => void;
}

export function SectionCard({ section, onViewDetails }: SectionCardProps) {
  const handleViewDetails = () => {
    onViewDetails(section);
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200 bg-white overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
              <MapPin className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                {section.name}
              </h3>
              <p className="text-sm text-gray-600 truncate mb-2">
                {section.location}
              </p>
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-gray-300 text-gray-600">
                {section.size_ha ? section.size_ha.toFixed(1) : "0"} ha
              </Badge>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="h-8 w-8 p-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {section.live?.workers || 0}
            </div>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Workers</div>
          </div>
          <div className="text-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {section.live?.active || 0}
            </div>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Active</div>
          </div>
          <div className="text-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {section.live?.complete || 0}
            </div>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Complete</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
