"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {getWorkflowById, getWorkflowMembers} from "@/lib/services/workflows/get";
import {deleteWorkflow} from "@/lib/services/workflows/post";
import {updateWorkflowStatus} from "@/lib/services/workflows/put";
import {DeleteDialog} from "@/components/shared/delete-dialog";
import {
  StatusToggleDialog,
  WorkflowHeader,
  WorkflowStatusSection,
  WorkflowScheduleSection,
  WorkflowLocationSection,
  WorkflowChecklistSection,
  WorkflowMembersSection,
} from "@/components/workflow/info";
import {WorkspaceInfo, WorkflowMember} from "@/lib/services/workflows/models";



export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<WorkspaceInfo | null>(null);
  const [members, setMembers] = useState<WorkflowMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToggleDialogOpen, setStatusToggleDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      setLoading(true);
      try {
        const [workflowData, membersData] = await Promise.all([
          getWorkflowById(params.id as string),
          getWorkflowMembers(params.id as string),
        ]);

        setWorkflow(workflowData);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch workflow details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/dashboard/workflows/${params.id}/update`);
  };

  const handleDelete = async () => {
    try {
      await deleteWorkflow(params.id as string);
      router.push('/dashboard/workflows');
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      alert('Failed to delete workflow. Please try again.');
    }
  };

  const handleToggleStatus = async () => {
    if (!workflow) return;
    
    const newStatus = workflow.status === 'running' ? 'stopped' : 'running';
    
    try {
      const success = await updateWorkflowStatus(params.id as string, newStatus);
      if (success) {
        // Close the dialog first
        setStatusToggleDialogOpen(false);
        // Refresh the workflow data to get updated status
        const updatedWorkflow = await getWorkflowById(params.id as string);
        setWorkflow(updatedWorkflow);
      } else {
        alert('Failed to update workflow status. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update workflow status:', error);
      alert('Failed to update workflow status. Please try again.');
    }
  };

  const handleStatusToggleClick = () => {
    setStatusToggleDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading workflow details...</p>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Workflow Not Found
          </h3>
          <p className="text-sm text-gray-600">
            The workflow you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      <WorkflowHeader
        workflow={workflow}
        onEdit={handleEdit}
        onDelete={() => setDeleteDialogOpen(true)}
        onToggleStatus={handleStatusToggleClick}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 pb-12 space-y-6">
        <WorkflowStatusSection workflow={workflow} />
        <WorkflowScheduleSection workflow={workflow} />
        <WorkflowLocationSection workflow={workflow} />
        <WorkflowChecklistSection workflow={workflow} />
        <WorkflowMembersSection members={members} />
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Workflow"
        description="This action cannot be undone. This will permanently delete the workflow and all associated data."
        itemName={workflow?.title}
      />

      {/* Status Toggle Dialog */}
      <StatusToggleDialog
        open={statusToggleDialogOpen}
        onOpenChange={setStatusToggleDialogOpen}
        onConfirm={handleToggleStatus}
        currentStatus={workflow?.status || 'stopped'}
        workflowTitle={workflow?.title}
      />
    </div>
  );
}
