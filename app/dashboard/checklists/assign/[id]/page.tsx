"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, Calendar, FileText, Loader2, MapPin, Shield, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getChecklistsInfo } from "@/lib/services/checklist/actions";
import { assignChecklist } from "@/lib/services/checklist/actions";
import {
  ChecklistInfo,
  AssignedChecklistParams,
} from "@/lib/services/checklist/models";
import { BasicInfoForm } from "@/components/checklist/assign/basic-info-form";
import { MembersTableForm } from "@/components/checklist/assign/members-table-form";
import { LocationTableForm } from "@/components/checklist/assign/location-table-form";
import { GeofencingForm } from "@/components/checklist/assign/geofencing-form";

export default function AssignChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [checklist, setChecklist] = useState<ChecklistInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [priority, setPriority] = useState<"high" | "mid" | "low">("mid");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [geofenceEnabled, setGeofenceEnabled] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load checklist details
        const checklistData = await getChecklistsInfo(id);
        setChecklist(checklistData);
        setTitle(checklistData.name); // Default title to checklist name
      } catch (err) {
        setError("Failed to load checklist details. Please try again.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAssign = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!title.trim() || selectedMembers.length === 0 || !selectedSection) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one team member.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAssigning(true);

      const assignData: AssignedChecklistParams = {
        title: title.trim(),
        notes: notes.trim(),
        priority,
        checklist_id: id,
        member_ids: selectedMembers,
        section_id: selectedSection,
        geofence_enabled: geofenceEnabled
      };

      const result = await assignChecklist(assignData);

      if (result.success) {
        toast({
          title: "Checklist Assigned",
          description: "The checklist has been successfully assigned.",
        });
        router.push("/dashboard/checklists");
      } else {
        throw new Error(result.error || "Failed to assign checklist");
      }
    } catch (error) {
      console.error("Error assigning checklist:", error);
      toast({
        title: "Assignment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign checklist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">
            Loading checklist details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !checklist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Checklist
          </h3>
          <p className="text-sm text-red-600">{error}</p>
          <Button
            onClick={() => router.push("/dashboard/checklists")}
            className="mt-4"
          >
            Back to Checklists
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      {/* Page Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Assign Checklist
              </h1>
            </div>
            <Button
              onClick={handleAssign}
              disabled={
                assigning ||
                !title.trim() ||
                selectedMembers.length === 0 ||
                !selectedSection ||
                loading
              }
              className="px-4 py-2 text-sm"
            >
              {assigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                `Assign ${checklist?.name || "Checklist"}`
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-6 pb-12">
        <form onSubmit={handleAssign} className="space-y-6">
          {/* Basic Information */}
          <BasicInfoForm
            title={title}
            notes={notes}
            priority={priority}
            onTitleChange={setTitle}
            onNotesChange={setNotes}
            onPriorityChange={setPriority}
          />

          {/* Team Member Assignment */}
          <MembersTableForm
            selectedMemberIds={selectedMembers}
            onMemberToggle={handleMemberToggle}
          />

          {/* Location Assignment */}
          <LocationTableForm
            selectedSectionId={selectedSection}
            onSectionChange={setSelectedSection}
          />

          {/* Geofencing Requirements */}
          <GeofencingForm
            geofencing={geofenceEnabled}
            onGeofencingChange={setGeofenceEnabled}
          />
        </form>
      </div>
    </div>
  );
}
