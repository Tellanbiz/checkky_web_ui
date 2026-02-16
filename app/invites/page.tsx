"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyTeamInvitesAction,
  acceptTeamInviteAction,
} from "@/lib/services/teams/actions";
import { TeamInviteInfo } from "@/lib/services/teams/data";
import { Account } from "@/lib/services/accounts/models";
import { getAccount } from "@/lib/services/auth/auth-get";

export default function InvitesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [processing, setProcessing] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch account - redirect to signup if not authenticated
  const { error: accountError } = useQuery<Account>({
    queryKey: ["account"],
    queryFn: getAccount,
    retry: false,
  });

  React.useEffect(() => {
    if (accountError) {
      router.push("/auth/signup");
    }
  }, [accountError, router]);

  const {
    data: invites = [],
    isLoading,
    error,
  } = useQuery<TeamInviteInfo[]>({
    queryKey: ["teamInvites"],
    queryFn: getMyTeamInvitesAction,
    retry: false,
  });

  const acceptInviteMutation = useMutation({
    mutationFn: ({ inviteId, accept }: { inviteId: string; accept: boolean }) =>
      acceptTeamInviteAction(inviteId, accept),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast({
          title: variables.accept ? "Invite Accepted!" : "Invite Declined",
          description: variables.accept
            ? "You have successfully joined the team."
            : "You have declined the team invitation.",
        });

        // Update the invites list by invalidating the query
        queryClient.invalidateQueries({ queryKey: ["teamInvites"] });

        // Redirect to dashboard after successful acceptance
        if (variables.accept) {
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } else {
        toast({
          title: "Error",
          description:
            result.error ||
            `Failed to ${variables.accept ? "accept" : "decline"} invite`,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to process invite. Please try again.`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setProcessing(null);
    },
  });

  const handleAcceptInvite = (inviteId: string) => {
    setProcessing(inviteId);
    acceptInviteMutation.mutate({ inviteId, accept: true });
  };

  const handleDeclineInvite = (inviteId: string) => {
    setProcessing(inviteId);
    acceptInviteMutation.mutate({ inviteId, accept: false });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "declined":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "declined":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your invitations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Team Invitations
          </h1>
          <p className="text-gray-600">
            Review and respond to your team invitations
          </p>
        </div>

        {/* Invites List */}
        {invites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Invitations Found
              </h3>
              <p className="text-gray-500 mb-6">
                You don't have any pending team invitations at the moment.
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-green-600 hover:bg-green-700"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => (
              <Card
                key={invite.id}
                className="hover:shadow-md transition-shadow duration-200 border border-gray-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Company Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {invite.company.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            You've been invited to join a team as {invite.role}
                          </p>
                        </div>
                      </div>

                      {/* Invite Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {invite.email}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            {invite.role}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(invite.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getStatusColor(
                            invite.status,
                          )} flex items-center gap-1`}
                        >
                          {getStatusIcon(invite.status)}
                          {invite.status.charAt(0).toUpperCase() +
                            invite.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {invite.status.toLowerCase() === "pending" && (
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => handleAcceptInvite(invite.id)}
                          disabled={processing === invite.id}
                          className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                        >
                          {processing === invite.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Accepting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => handleDeclineInvite(invite.id)}
                          disabled={processing === invite.id}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 min-w-[120px]"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Continue Page */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
