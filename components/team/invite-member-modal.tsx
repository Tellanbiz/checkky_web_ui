"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Plus, X, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { inviteTeamMemberAction } from "@/lib/services/teams/actions";
import { useToast } from "@/hooks/use-toast";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
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
            invites: [
              {
                email: invite.email,
                role: invite.role as
                  | "admin"
                  | "auditor"
                  | "assignee"
                  | "viewer",
              },
            ],
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
    admin: "Full access to all features and settings",
    auditor: "Can create, edit, and complete checklists",
    assignee: "Can complete assigned checklists",
    viewer: "Read-only access to checklists and reports",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Form */}
          <div className="space-y-4">
            <Label>Team Member Invitations</Label>
            {invites.map((invite, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`email-${index}`}>Email Address</Label>
                      <Input
                        id={`email-${index}`}
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
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="auditor">Auditor</SelectItem>
                            <SelectItem value="assignee">Assignee</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
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
            <Label>Role Permissions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(roleDescriptions).map(([role, description]) => (
                <div key={role} className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline">{role}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Invitation Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Add a personal message to your invitation..."
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2 mb-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Invitation to join CheckIt</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{message}</p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Invitations will be sent to:
                </p>
                {invites
                  .filter((invite) => invite.email && invite.role)
                  .map((invite, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm">{invite.email}</span>
                      <Badge variant="secondary" className="text-xs">
                        {invite.role}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSendInvites}
              disabled={
                !invites.some((invite) => invite.email && invite.role) ||
                loading
              }
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {loading ? "Sending..." : "Send Invitations"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
