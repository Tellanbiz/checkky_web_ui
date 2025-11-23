"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Plus, Search, Loader2 } from "lucide-react";
import { EditSectionModal } from "@/components/sections/edit-section-modal";
import { SectionDetailsModal } from "@/components/sections/section-details-modal";
import { SectionCard } from "@/components/sections/section-card";
import { getAllSections } from "@/lib/services/sections/actions";
import { Farm } from "@/lib/services/sections/models";
import { useToast } from "@/hooks/use-toast";

export default function SectionsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [sections, setSections] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<Farm | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch farms data on component mount
  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const farms = await getAllSections();
      setSections(farms);
    } catch (error) {
      console.error("Failed to fetch farms:", error);
      toast({
        title: "Error",
        description: "Failed to load farm sections. Please try again.",
        variant: "destructive",
      });
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine farm type based on name/location
  const getFarmType = (
    name: string,
    location: string
  ): "pasture" | "cropland" | "facility" | "water" => {
    const lowerName = name.toLowerCase();
    const lowerLocation = location.toLowerCase();

    if (lowerName.includes("pasture") || lowerName.includes("grazing"))
      return "pasture";
    if (
      lowerName.includes("crop") ||
      lowerName.includes("field") ||
      lowerName.includes("farm")
    )
      return "cropland";
    if (
      lowerName.includes("barn") ||
      lowerName.includes("facility") ||
      lowerName.includes("complex")
    )
      return "facility";
    if (
      lowerName.includes("water") ||
      lowerName.includes("reservoir") ||
      lowerName.includes("pond")
    )
      return "water";

    // Default based on location keywords
    if (lowerLocation.includes("field")) return "cropland";
    if (lowerLocation.includes("barn")) return "facility";
    if (lowerLocation.includes("water")) return "water";

    return "cropland"; // Default fallback
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";

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

  const handleViewDetails = (section: Farm) => {
    setSelectedSection(section);
    setShowDetailsModal(true);
  };

  const handleEditSection = (section: Farm) => {
    setSelectedSection(section);
    setShowEditModal(true);
  };

  const handleAssignTasks = (section: Farm) => {
    toast({
      title: "Assign Tasks",
      description: `Opening task assignment for section "${section.name}"`,
    });
    // Here you would navigate to task assignment or open a modal
  };

  const filteredSections = sections.filter((section) => {
    const matchesSearch =
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (section.status && section.status === filterStatus);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
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

        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchFarms} disabled={loading}>
            <Loader2
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => router.push("/dashboard/sections/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Loading farm sections...
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while we fetch the data.
            </p>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No sections found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by adding your first farm section."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <div className="mt-6">
                <Button onClick={() => router.push("/dashboard/sections/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>
            )}
          </div>
        ) : (
          filteredSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {selectedSection && (
        <>
          <EditSectionModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            section={selectedSection}
            onSectionUpdated={(updatedSection: Farm) => {
              setSections(
                sections.map((s) =>
                  s.id === updatedSection.id ? updatedSection : s
                )
              );
              setSelectedSection(null);
              toast({
                title: "Section updated",
                description: `Section "${updatedSection.name}" updated.`,
              });
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
