import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, CheckCircle, Clock, Eye } from "lucide-react";

interface SectionCardProps {
  section: any; // Using any for now, should be properly typed
  onViewDetails: (section: any) => void;
}

export function SectionCard({ section, onViewDetails }: SectionCardProps) {
  const handleViewDetails = () => {
    onViewDetails(section);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white overflow-hidden hover:border-blue-300 hover:-translate-y-1">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
                {section.name}
              </h3>
              <p className="text-xs text-gray-600 truncate mb-2">
                {section.location}
              </p>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                >
                  {section.size_ha ? section.size_ha.toFixed(1) : "0"} ha
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0.5 ${
                    section.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {section.status || "active"}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Users className="h-3 w-3" />
            <span className="font-medium">{section.live?.workers || 0}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span className="font-medium">{section.live?.complete || 0}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-blue-600">
            <Clock className="h-3 w-3" />
            <span className="font-medium">{section.live?.active || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
