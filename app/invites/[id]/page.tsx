"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getTeamInviteInfoAction,
  acceptTeamInviteAction,
} from "@/lib/services/teams/actions";
import { TeamInviteInfo } from "@/lib/services/teams/data";

export default function InvitePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [invite, setInvite] = useState<TeamInviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const inviteData = await getTeamInviteInfoAction(params.id);
        if (inviteData) {
          setInvite(inviteData);
        } else {
          setError("Invite not found or has expired");
        }
      } catch (error) {
        console.error("Error fetching invite:", error);
        setError("Failed to load invite details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [params.id]);

  const handleAcceptInvite = async () => {
    if (!invite) return;

    setProcessing(true);
    try {
      const result = await acceptTeamInviteAction(invite.id, true);

      if (result.success) {
        toast({
          title: "Invite Accepted!",
          description: "You have successfully joined the team.",
        });

        // Redirect to dashboard after successful acceptance
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to accept invite",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept invite. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeclineInvite = async () => {
    if (!invite) return;

    setProcessing(true);
    try {
      const result = await acceptTeamInviteAction(invite.id, false);

      if (result.success) {
        toast({
          title: "Invite Declined",
          description: "You have declined this team invitation.",
        });

        // Redirect back to login or home page
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to decline invite",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline invite. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading invite details...</p>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || "Invite Not Found"}
            </h2>
            <p className="text-gray-600 mb-6">
              This invite may have expired or is no longer valid.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Team Invitation
          </h1>
          <p className="text-gray-600">You've been invited to join a team</p>
        </div>

        {/* Invite Details Card */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="text-xl font-semibold text-blue-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Invitation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {invite.company.name}
                  </h3>
                  <p className="text-sm text-gray-600">Company</p>
                </div>
              </div>

              {invite.company.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {invite.company.email}
                    </h3>
                    <p className="text-sm text-gray-600">Contact Email</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {new Date(invite.created_at).toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-gray-600">Invited on</p>
                </div>
              </div>

              {invite.role && (
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {invite.role}
                  </Badge>
                  <span className="text-sm text-gray-600">Role</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleAcceptInvite}
            disabled={processing}
            className="h-12 bg-green-600 hover:bg-green-700 text-white"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Invite
              </>
            )}
          </Button>

          <Button
            onClick={handleDeclineInvite}
            disabled={processing}
            variant="outline"
            className="h-12 border-red-200 text-red-600 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Decline Invite
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By accepting this invitation, you'll be added to the team and gain
            access to team resources.
          </p>
        </div>
      </div>
    </div>
  );
}
