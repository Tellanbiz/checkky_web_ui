"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Users, Calendar, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getChecklistsInfo } from "@/lib/services/checklist/actions";
import { assignChecklist } from "@/lib/services/checklist/actions";
import {
  ChecklistInfo,
  AssignedChecklistParams,
} from "@/lib/services/checklist/models";
import { getTeamMembersAction } from "@/lib/services/teams/actions";
import { TeamMember } from "@/lib/services/teams/data";
import { getAllSections } from "@/lib/services/sections/actions";
import { Farm } from "@/lib/services/sections/models";

export default function AssignChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [checklist, setChecklist] = useState<ChecklistInfo | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sections, setSections] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [selectedMember, setSelectedMember] = useState("");
  const [priority, setPriority] = useState<"high" | "mid" | "low">("mid");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load checklist details
        const checklistData = await getChecklistsInfo(id);
        setChecklist(checklistData);
        setTitle(checklistData.name); // Default title to checklist name

        // Load team members using getTeamMembersAction
        const teamResult = await getTeamMembersAction();
        console.log("Team result:", teamResult); // Debug log
        if (teamResult.success && teamResult.data) {
          setTeamMembers(teamResult.data);
          console.log("Team members loaded:", teamResult.data); // Debug log
        } else {
          console.error("Failed to load team members:", teamResult.error);
        }

        // Load sections using getAllSections
        const sectionsData = await getAllSections();
        console.log("Sections result:", sectionsData); // Debug log
        if (sectionsData && Array.isArray(sectionsData)) {
          setSections(sectionsData);
          console.log("Sections loaded:", sectionsData); // Debug log
        } else {
          console.error("Failed to load sections:", sectionsData);
        }
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

    if (!selectedMember || !title.trim() || !deadline || !selectedSection) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including deadline and section.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAssigning(true);

      // Convert date to UTC
      const deadlineUTC = deadline ? new Date(deadline + 'T00:00:00').toISOString() : '';

      const assignData: AssignedChecklistParams = {
        title: title.trim(),
        notes: notes.trim(),
        priority,
        checklist_id: id,
        member_id: selectedMember,
        deadline: deadlineUTC,
        section_id: selectedSection
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Assign Checklist
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Assign this checklist to a team member
              </p>
            </div>
            <Button
              onClick={handleAssign}
              disabled={assigning || !selectedMember || !title.trim() || !deadline || !selectedSection}
              className="px-6 py-2"
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

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Assignment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAssign} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter assignment title"
                      required
                    />
                  </div>

                  {/* Team Member Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="member">Assign To *</Label>
                    <Select
                      value={selectedMember}
                      onValueChange={setSelectedMember}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{member.user.full_name}</span>
                              <Badge variant="outline" className="text-xs">
                                {member.role}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Debug info */}
                    <div className="text-xs text-gray-500 mt-1">
                      {teamMembers.length > 0
                        ? `${teamMembers.length} team member(s) loaded`
                        : "No team members loaded"}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                      value={priority}
                      onValueChange={(value: "high" | "mid" | "low") =>
                        setPriority(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>High Priority</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="mid">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>Medium Priority</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Low Priority</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Deadline */}
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                    />
                  </div>

                  {/* Section Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="section">Section *</Label>
                    <Select
                      value={selectedSection}
                      onValueChange={setSelectedSection}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>{section.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {section.location}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Debug info */}
                    <div className="text-xs text-gray-500 mt-1">
                      {sections.length > 0
                        ? `${sections.length} section(s) loaded`
                        : "No sections loaded"}
                    </div>
                  </div>
                  

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional notes or instructions for this assignment..."
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
