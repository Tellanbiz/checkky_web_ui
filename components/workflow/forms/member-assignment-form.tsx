"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamMember } from "@/lib/services/teams/data";
import { getTeamMembers } from "@/lib/services/teams/get";
import { Search, Users, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemberAssignmentFormProps {
  selectedMemberIds: string[];
  onMemberToggle: (memberId: string) => void;
}

export function MemberAssignmentForm({
  selectedMemberIds,
  onMemberToggle,
}: MemberAssignmentFormProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [availableMembers, setAvailableMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Get token from localStorage or auth context
        const token = localStorage.getItem('auth_token') || '';
        const members = await getTeamMembers(token);
        setAvailableMembers(members);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        toast({
          title: "Error",
          description: "Failed to load team members",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [toast]);

  const filteredMembers = availableMembers.filter(member =>
    member.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMembers = availableMembers.filter(m => selectedMemberIds.includes(m.id));

  const handleSelectAll = () => {
    if (selectedMemberIds.length === filteredMembers.length) {
      // Deselect all filtered members
      filteredMembers.forEach(member => {
        if (selectedMemberIds.includes(member.id)) {
          onMemberToggle(member.id);
        }
      });
    } else {
      // Select all filtered members
      filteredMembers.forEach(member => {
        if (!selectedMemberIds.includes(member.id)) {
          onMemberToggle(member.id);
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Team Member Assignment</CardTitle>
          <CardDescription>
            Select team members who will be assigned this workflow checklist.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Actions */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={filteredMembers.length === 0}
          >
            {selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {/* Selected Members Display */}
        {selectedMembers.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-900">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectedMembers.forEach(m => onMemberToggle(m.id))}
                className="text-green-600 hover:text-green-800 h-6 px-2"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedMembers.map(member => (
                <Badge key={member.id} variant="secondary" className="text-xs">
                  {member.user.full_name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Members Display */}
        <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No team members found matching "{searchTerm}"</p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const isSelected = selectedMemberIds.includes(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => onMemberToggle(member.id)}
                  className={`
                    cursor-pointer transition-all duration-200
                    p-4 border rounded-lg hover:shadow-md ${
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }
                  `}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{member.user.full_name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <UserCheck className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserX className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Team Member</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{member.checklist_stats.total} tasks</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Member Count */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} available</span>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear search
            </Button>
          )}
        </div>

        {/* Member Assignment Tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Assign multiple members for critical safety checklists to ensure coverage</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Consider team member availability and workload</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Include backup members for essential tasks</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
