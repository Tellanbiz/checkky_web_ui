"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Users,
  Clipboard,
  MilkIcon as Cow,
  Wheat,
  Tractor,
  Droplets,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface SectionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: any;
}

export function SectionDetailsModal({
  open,
  onOpenChange,
  section,
}: SectionDetailsModalProps) {
  if (!section) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pasture":
        return <Cow className="h-5 w-5" />;
      case "cropland":
        return <Wheat className="h-5 w-5" />;
      case "facility":
        return <Tractor className="h-5 w-5" />;
      case "water":
        return <Droplets className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const completionRate =
    section.activeTasks + section.completedTasks > 0
      ? (
          (section.completedTasks /
            (section.activeTasks + section.completedTasks)) *
          100
        ).toFixed(1)
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getTypeIcon(section.type)}
            <div>
              <DialogTitle className="text-2xl">{section.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(section.status)}>
                  {section.status.charAt(0).toUpperCase() +
                    section.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {section.acreage} acres • {section.type}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {section.description && (
            <div>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">
                  {section.assignedWorkers}
                </div>
                <div className="text-xs text-muted-foreground">
                  Assigned Workers
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{section.activeTasks}</div>
                <div className="text-xs text-muted-foreground">
                  Active Tasks
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">
                  {section.completedTasks}
                </div>
                <div className="text-xs text-muted-foreground">
                  Completed Tasks
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clipboard className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{completionRate}%</div>
                <div className="text-xs text-muted-foreground">
                  Completion Rate
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Coordinates</div>
                  <div className="text-sm text-muted-foreground">
                    {section.coordinates.lat.toFixed(6)},{" "}
                    {section.coordinates.lng.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Total Area</div>
                  <div className="text-sm text-muted-foreground">
                    {section.acreage} acres
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Last Inspection</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(section.lastInspection).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Type-specific Information */}
          {section.livestock && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cow className="h-5 w-5" />
                  Livestock Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-sm text-muted-foreground">
                      {section.livestock.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Current Count</div>
                    <div className="text-sm text-muted-foreground">
                      {section.livestock.count}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Capacity</div>
                    <div className="text-sm text-muted-foreground">
                      {section.livestock.capacity}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium mb-1">Utilization</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (section.livestock.count /
                            section.livestock.capacity) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(
                      (section.livestock.count / section.livestock.capacity) *
                      100
                    ).toFixed(1)}
                    % capacity used
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {section.crops && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5" />
                  Crop Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Crop Type</div>
                    <div className="text-sm text-muted-foreground">
                      {section.crops.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Planted Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(section.crops.plantedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Expected Harvest</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(
                        section.crops.expectedHarvest
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipment */}
          {section.equipment && section.equipment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tractor className="h-5 w-5" />
                  Equipment & Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {section.equipment.map((item: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Daily inspection completed
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Maintenance task assigned
                    </div>
                    <div className="text-xs text-muted-foreground">
                      5 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Weather alert issued
                    </div>
                    <div className="text-xs text-muted-foreground">
                      1 day ago
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
