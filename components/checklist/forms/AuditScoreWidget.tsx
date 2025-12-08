'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuditScore } from '@/lib/services/checklist-assigned/models';
import { score } from '@/lib/services/auditor/post';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AuditScoreWidgetProps {
  auditScore: AuditScore;
  onAuditScoreChange: (score: AuditScore) => void;
  disabled?: boolean;
  questionId: number;
  checklistAnswerId?: string;
  checklistStatus: 'pending' | 'in_progress' | 'completed';
  hasAnswer: boolean;
}

export function AuditScoreWidget({
  auditScore,
  onAuditScoreChange,
  disabled = false,
  questionId,
  checklistAnswerId,
  checklistStatus,
  hasAnswer
}: AuditScoreWidgetProps) {
  const queryClient = useQueryClient();

  const scoreMutation = useMutation({
    mutationFn: (scoreValue: AuditScore) => {
      if (!checklistAnswerId) {
        throw new Error('No checklist answer ID available');
      }
      return score({
        checklist_answer_id: checklistAnswerId,
        score: scoreValue
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    }
  });

  // Check if scoring is allowed
  const canScore = checklistStatus === 'completed' && hasAnswer && !disabled && !!checklistAnswerId;
  const scoringDisabled = !canScore || scoreMutation.isPending;
  const getScoreColor = (score: AuditScore) => {
    switch (score) {
      case AuditScore.FullyCompliant:
        return 'bg-green-100 text-green-800 border-green-200';
      case AuditScore.MostlyCompliant:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case AuditScore.PartiallyCompliant:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case AuditScore.NotCompliant:
        return 'bg-red-100 text-red-800 border-red-200';
      case AuditScore.Pending:
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreLabel = (score: AuditScore) => {
    switch (score) {
      case AuditScore.FullyCompliant:
        return 'Fully Compliant';
      case AuditScore.MostlyCompliant:
        return 'Mostly Compliant';
      case AuditScore.PartiallyCompliant:
        return 'Partially Compliant';
      case AuditScore.NotCompliant:
        return 'Not Compliant';
      case AuditScore.Pending:
      default:
        return 'Pending';
    }
  };

  const handleScoreChange = async (newScore: AuditScore) => {
    if (!canScore) return;
    
    try {
      await scoreMutation.mutateAsync(newScore);
      onAuditScoreChange(newScore);
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">Audit Score</Label>
        <Badge variant="outline" className={`text-xs ${getScoreColor(auditScore)}`}>
          {getScoreLabel(auditScore)}
        </Badge>
      </div>

      {!canScore && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            {checklistStatus !== 'completed' 
              ? 'Scoring is only available when checklist is completed'
              : !hasAnswer 
                ? 'Scoring requires an answer to be provided'
                : !checklistAnswerId
                  ? 'Scoring requires a valid checklist answer ID'
                  : 'Scoring is currently disabled'
            }
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600">Score Level</Label>
        <Select
          value={auditScore}
          onValueChange={(value) => handleScoreChange(value as AuditScore)}
          disabled={scoringDisabled}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AuditScore.Pending}>Pending</SelectItem>
            <SelectItem value={AuditScore.NotCompliant}>Not Compliant</SelectItem>
            <SelectItem value={AuditScore.PartiallyCompliant}>Partially Compliant</SelectItem>
            <SelectItem value={AuditScore.MostlyCompliant}>Mostly Compliant</SelectItem>
            <SelectItem value={AuditScore.FullyCompliant}>Fully Compliant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {scoreMutation.isPending && (
        <div className="text-xs text-blue-600 text-center">
          Saving score...
        </div>
      )}
    </div>
  );
}
