"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { AuditCard } from "@/components/audits/audit-card";
import { GetOngoingAuditsRow } from "@/lib/services/auditors/data";
import { Input } from "@/components/ui/input";

interface OngoingAuditListProps {
  audits: GetOngoingAuditsRow[];
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  getInitials: (name: string) => string;
  formatDate: (dateString: string) => string;
  calculateProgress: (total: number, completed: number) => number;
}

export function OngoingAuditList({
  audits,
  getPriorityColor,
  getStatusColor,
  getInitials,
  formatDate,
  calculateProgress,
}: OngoingAuditListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAudits = audits.filter(
    (audit) =>
      audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.assigned_member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.auditor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Field */}
      <div className="mb-6">
        <Input
          placeholder="Search audits by title, assignee, auditor, priority, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredAudits.length === 0 && searchTerm ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No audits found matching "{searchTerm}"</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your search terms
          </p>
        </div>
      ) : filteredAudits.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No ongoing audits found</p>
          <p className="text-sm text-gray-400 mt-1">
            Audits will appear here once they have been assigned and scoring
            has begun
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAudits.map((audit) => (
            <AuditCard
              key={audit.id}
              audit={audit}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
              getInitials={getInitials}
              formatDate={formatDate}
              calculateProgress={calculateProgress}
              isCompleted={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
