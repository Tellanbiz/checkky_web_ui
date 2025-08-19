"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Send, Loader2 } from "lucide-react";
import { inviteTeamMemberAction } from "@/lib/services/teams/actions";
import { useToast } from "@/hooks/use-toast";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent?: () => void;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  onInviteSent,
}: InviteMemberModalProps) {
  const [invites, setInvites] = useState([{ email: "", role: "" }]);
  const [message, setMessage] = useState(
    "You've been invited to join our team on CheckIt. Click the link below to accept your invitation and get started."
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addInvite = () => {
    setInvites([...invites, { email: "", role: "" }]);
  };

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const updateInvite = (index: number, field: string, value: string) => {
    const updated = invites.map((invite, i) =>
      i === index ? { ...invite, [field]: value } : invite
    );
    setInvites(updated);
  };

  const handleSendInvites = async () => {
    // Validate invites
    const validInvites = invites.filter(
      (invite) => invite.email && invite.role
    );
    if (validInvites.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in at least one valid email and role.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Send each invite
      const results = await Promise.all(
        validInvites.map((invite) =>
          inviteTeamMemberAction({
            email: invite.email,
            role: invite.role,
            message: message,
          })
        )
      );

      // Check results
      const successCount = results.filter((result) => result.success).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast({
          title: "Invitations Sent",
          description: `Successfully sent ${successCount} invitation(s).${
            failureCount > 0 ? ` ${failureCount} failed.` : ""
          }`,
        });

        // Call callback to refresh parent component
        if (onInviteSent) {
          onInviteSent();
        }

        // Reset form and close modal
        setInvites([{ email: "", role: "" }]);
        setMessage(
          "You've been invited to join our team on CheckIt. Click the link below to accept your invitation and get started."
        );
        onClose();
      } else {
        toast({
          title: "All Invitations Failed",
          description: "Failed to send any invitations. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending invites:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while sending invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const roleDescriptions = {
    Admin: "Full access to all features and settings",
    Auditor: "Can create, edit, and complete checklists",
    Assignee: "Can complete assigned checklists",
    Viewer: "Read-only access to checklists and reports",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invitation Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invitation Message</Label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Enter a custom message for your invitations..."
              />
            </div>

            {invites.map((invite, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="colleague@company.com"
                        value={invite.email}
                        onChange={(e) =>
                          updateInvite(index, "email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex space-x-2">
                        <Select
                          value={invite.role}
                          onValueChange={(value) =>
                            updateInvite(index, "role", value)
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Auditor">Auditor</SelectItem>
                            <SelectItem value="Assignee">Assignee</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        {invites.length > 1 && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => removeInvite(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {invite.role && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {
                          roleDescriptions[
                            invite.role as keyof typeof roleDescriptions
                          ]
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addInvite}
              className="w-full bg-transparent"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Invitation
            </Button>
          </div>

          {/* Role Information */}
          <div className="space-y-3">
            <Label>Role Descriptions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="font-medium text-sm">Admin</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Full access to all features, team management, and system
                    settings
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="font-medium text-sm">Auditor</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Can create, edit, and complete checklists, view team
                    performance
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="font-medium text-sm">Assignee</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Can complete assigned checklists and upload evidence
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                    <span className="font-medium text-sm">Viewer</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Read-only access to checklists, reports, and guidelines
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSendInvites} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invitations
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
