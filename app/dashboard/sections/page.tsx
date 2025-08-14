"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Plus,
  Search,
  MoreVertical,
  Users,
  Clipboard,
  CheckCircle,
  Tractor,
  MilkIcon as Cow,
  Wheat,
} from "lucide-react";
import { AddSectionModal } from "@/components/sections/add-section-modal";
import { EditSectionModal } from "@/components/sections/edit-section-modal";
import { SectionDetailsModal } from "@/components/sections/section-details-modal";

interface FarmSection {
  id: string;
  name: string;
  type: "pasture" | "cropland" | "facility" | "water";
  acreage: number;
  status: "active" | "maintenance" | "inactive";
  assignedWorkers: number;
  activeTasks: number;
  completedTasks: number;
  lastInspection: string;
  coordinates: { lat: number; lng: number };
  description: string;
  livestock?: {
    type: string;
    count: number;
    capacity: number;
  };
  crops?: {
    type: string;
    plantedDate: string;
    expectedHarvest: string;
  };
  equipment?: string[];
}

const mockSections: FarmSection[] = [
  {
    id: "1",
    name: "North Pasture A1",
    type: "pasture",
    acreage: 45.5,
    status: "active",
    assignedWorkers: 3,
    activeTasks: 5,
    completedTasks: 12,
    lastInspection: "2024-01-12",
    coordinates: { lat: 40.7128, lng: -74.006 },
    description: "Primary cattle grazing area with automatic water systems",
    livestock: {
      type: "Cattle",
      count: 85,
      capacity: 100,
    },
    equipment: ["Water Trough System", "Fence Gates", "Shade Structures"],
  },
  {
    id: "2",
    name: "South Crop Field S1",
    type: "cropland",
    acreage: 120.0,
    status: "active",
    assignedWorkers: 2,
    activeTasks: 8,
    completedTasks: 25,
    lastInspection: "2024-01-10",
    coordinates: { lat: 40.7, lng: -74.01 },
    description: "Main corn production field with center pivot irrigation",
    crops: {
      type: "Corn",
      plantedDate: "2024-04-15",
      expectedHarvest: "2024-09-30",
    },
    equipment: ["Center Pivot Irrigation", "Soil Sensors", "Weather Station"],
  },
  {
    id: "3",
    name: "Main Barn Complex",
    type: "facility",
    acreage: 2.5,
    status: "maintenance",
    assignedWorkers: 4,
    activeTasks: 3,
    completedTasks: 8,
    lastInspection: "2024-01-08",
    coordinates: { lat: 40.705, lng: -74.008 },
    description: "Central facility housing equipment and feed storage",
    equipment: [
      "Milking Equipment",
      "Feed Mixers",
      "Tractors",
      "Storage Silos",
    ],
  },
  {
    id: "4",
    name: "East Water Reservoir",
    type: "water",
    acreage: 8.0,
    status: "active",
    assignedWorkers: 1,
    activeTasks: 2,
    completedTasks: 6,
    lastInspection: "2024-01-11",
    coordinates: { lat: 40.708, lng: -74.004 },
    description: "Primary water source for irrigation and livestock",
    equipment: ["Pump Systems", "Filtration Units", "Water Quality Sensors"],
  },
];

export default function SectionsPage() {
  const [sections, setSections] = useState<FarmSection[]>(mockSections);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<FarmSection | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
        return <Cow className="h-4 w-4" />;
      case "cropland":
        return <Wheat className="h-4 w-4" />;
      case "facility":
        return <Tractor className="h-4 w-4" />;
      case "water":
        return <MapPin className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredSections = sections.filter((section) => {
    const matchesSearch =
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || section.type === filterType;
    const matchesStatus =
      filterStatus === "all" || section.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalAcreage = sections.reduce(
    (sum, section) => sum + section.acreage,
    0
  );
  const activeSections = sections.filter((s) => s.status === "active").length;
  const totalTasks = sections.reduce(
    (sum, section) => sum + section.activeTasks,
    0
  );
  const totalWorkers = sections.reduce(
    (sum, section) => sum + section.assignedWorkers,
    0
  );

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farm Sections</h1>
          <p className="text-muted-foreground">
            Manage and monitor all sections of your ranch
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Acreage</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAcreage.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Across {sections.length} sections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sections
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSections}</div>
            <p className="text-xs text-muted-foreground">
              {((activeSections / sections.length) * 100).toFixed(0)}%
              operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">Across all sections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Workers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkers}</div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pasture">Pasture</SelectItem>
            <SelectItem value="cropland">Cropland</SelectItem>
            <SelectItem value="facility">Facility</SelectItem>
            <SelectItem value="water">Water</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSections.map((section) => (
          <Card key={section.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(section.type)}
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSection(section);
                        setShowDetailsModal(true);
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSection(section);
                        setShowEditModal(true);
                      }}
                    >
                      Edit Section
                    </DropdownMenuItem>
                    <DropdownMenuItem>Assign Tasks</DropdownMenuItem>
                    <DropdownMenuItem>View History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(section.status)}>
                    {section.status.charAt(0).toUpperCase() +
                      section.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {section.acreage} acres
                  </span>
                </div>

                {section.livestock && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Livestock:</span>
                    <span>
                      {section.livestock.count}/{section.livestock.capacity}{" "}
                      {section.livestock.type}
                    </span>
                  </div>
                )}

                {section.crops && (
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Crop:</span>
                      <span>{section.crops.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Harvest:</span>
                      <span>
                        {new Date(
                          section.crops.expectedHarvest
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {section.assignedWorkers}
                    </div>
                    <div className="text-xs text-muted-foreground">Workers</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-orange-600">
                      {section.activeTasks}
                    </div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {section.completedTasks}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Complete
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Last inspection:{" "}
                  {new Date(section.lastInspection).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No sections found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by adding your first farm section."}
          </p>
          {!searchTerm && filterType === "all" && filterStatus === "all" && (
            <div className="mt-6">
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddSectionModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSectionAdded={(newSection: FarmSection) => {
          setSections([
            ...sections,
            { ...newSection, id: Date.now().toString() },
          ]);
        }}
      />

      {selectedSection && (
        <>
          <EditSectionModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            section={selectedSection}
            onSectionUpdated={(updatedSection: FarmSection) => {
              setSections(
                sections.map((s) =>
                  s.id === updatedSection.id ? updatedSection : s
                )
              );
              setSelectedSection(null);
            }}
          />

          <SectionDetailsModal
            open={showDetailsModal}
            onOpenChange={setShowDetailsModal}
            section={selectedSection}
          />
        </>
      )}
    </div>
  );
}
