'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeamMembers } from '@/lib/services/teams/get';
import { assignAuditor } from '@/lib/services/auditor/post';
import { TeamMember } from '@/lib/services/teams/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User } from 'lucide-react';

interface AssignAuditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAuditorId?: string;
  checklistId: string;
  onAssignAuditor: (member: TeamMember) => void;
}

export function AssignAuditorDialog({
  open,
  onOpenChange,
  currentAuditorId,
  checklistId,
  onAssignAuditor
}: AssignAuditorDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const assignAuditorMutation = useMutation({
    mutationFn: (memberId: string) => assignAuditor({
      member_id: memberId,
      assigned_checklist_id: checklistId
    }),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    }
  });

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => getTeamMembers(localStorage.getItem('token') || ''),
    enabled: open,
  });

  // Filter for admin, super-admin, and auditor roles
  const eligibleMembers = teamMembers.filter(member => 
    ['admin', 'super-admin', 'auditor'].includes(member.role.toLowerCase())
  );

  // Filter by search term
  const filteredMembers = eligibleMembers.filter(member =>
    member.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super-admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'auditor':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAssignAuditor = async (member: TeamMember) => {
    try {
      await assignAuditorMutation.mutateAsync(member.id);
      onAssignAuditor(member);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to assign auditor:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {currentAuditorId ? 'Reassign Auditor' : 'Assign Auditor'}
          </DialogTitle>
          <DialogDescription>
            Select a team member with admin, super-admin, or auditor role to assign as the checklist auditor.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No members found matching your search.' : 'No eligible team members found.'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Only admin, super-admin, and auditor roles can be assigned as auditors.
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                  currentAuditorId === member.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.user.picture} alt={member.user.full_name} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
                      {getInitials(member.user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{member.user.full_name}</p>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={`text-xs ${getRoleColor(member.role)}`}>
                    {member.role}
                  </Badge>
                  {currentAuditorId === member.id && (
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                      Current
                    </Badge>
                  )}
                  <Button
                    onClick={() => handleAssignAuditor(member)}
                    variant="outline"
                    size="sm"
                    disabled={currentAuditorId === member.id || assignAuditorMutation.isPending}
                  >
                    {assignAuditorMutation.isPending && assignAuditorMutation.variables === member.id 
                      ? 'Assigning...' 
                      : currentAuditorId === member.id 
                        ? 'Assigned' 
                        : 'Assign'
                    }
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
