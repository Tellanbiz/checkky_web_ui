"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Save, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import type { UpdateProfileParams } from "@/lib/services/accounts/models";
import { getAccount } from "@/lib/services/accounts/services-get";
import {
  requestEmailChange,
  updateProfile,
  verifyEmailChange,
} from "@/lib/services/accounts/services-post";

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: getAccount,
    staleTime: 1000 * 60 * 5,
  });

  const [formData, setFormData] = useState<UpdateProfileParams | null>(null);
  const [nextEmail, setNextEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Derive form values — sync from query on first load
  const form = formData ?? {
    full_name: account?.full_name ?? "",
    picture: account?.picture ?? "",
  };

  const profileMutation = useMutation({
    mutationFn: (data: UpdateProfileParams) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast({ title: "Saved", description: "Your profile was updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const emailRequestMutation = useMutation({
    mutationFn: (email: string) => requestEmailChange({ email }),
    onSuccess: () => {
      setVerificationCode("");
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast({ title: "Verification sent", description: "Check the new email for a code." });
    },
    onError: (error: Error) => {
      toast({ title: "Unable to change email", description: error.message, variant: "destructive" });
    },
  });

  const emailVerifyMutation = useMutation({
    mutationFn: (code: string) => verifyEmailChange({ code }),
    onSuccess: () => {
      setNextEmail("");
      setVerificationCode("");
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast({ title: "Email updated", description: "Your email has been verified and updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate(form);
  };

  const handleEmailRequest = (e: React.FormEvent) => {
    e.preventDefault();
    emailRequestMutation.mutate(nextEmail);
  };

  const handleEmailVerify = (e: React.FormEvent) => {
    e.preventDefault();
    emailVerifyMutation.mutate(verificationCode);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-black/30" />
        <span className="ml-2 text-[13px] text-black/40">Loading profile…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Personal info */}
      <section>
        <div className="mb-4">
          <h2 className="text-[15px] font-semibold text-black">Personal information</h2>
          <p className="text-[13px] text-black/40 mt-0.5">
            Update your name and profile details visible to your team.
          </p>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-[12px] font-medium text-black/60">
                Full name
              </Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    full_name: e.target.value,
                    picture: prev?.picture ?? account?.picture ?? "",
                  }))
                }
                placeholder="Your full name"
                className="h-9 text-[13px] border-neutral-200 focus-visible:ring-1 focus-visible:ring-black/20"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="current_email" className="text-[12px] font-medium text-black/60">
                Current email
              </Label>
              <Input
                id="current_email"
                value={account?.email ?? ""}
                disabled
                className="h-9 text-[13px] border-neutral-200 bg-neutral-50"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={profileMutation.isPending}
              size="sm"
              className="h-8 text-[12px] px-4"
            >
              {profileMutation.isPending ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5" />
              )}
              {profileMutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </section>

      <div className="border-t border-neutral-100" />

      {/* Change email */}
      <section>
        <div className="mb-4">
          <h2 className="text-[15px] font-semibold text-black flex items-center gap-2">
            <Mail className="h-4 w-4 text-black/50" />
            Change email
          </h2>
          <p className="text-[13px] text-black/40 mt-0.5">
            Request a new email, then verify it with the code we send.
          </p>
        </div>
        <form onSubmit={handleEmailRequest} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="new_email" className="text-[12px] font-medium text-black/60">
              New email address
            </Label>
            <Input
              id="new_email"
              type="email"
              value={nextEmail}
              onChange={(e) => setNextEmail(e.target.value)}
              placeholder="name@company.com"
              className="h-9 text-[13px] border-neutral-200 focus-visible:ring-1 focus-visible:ring-black/20 max-w-sm"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={emailRequestMutation.isPending}
            variant="outline"
            size="sm"
            className="h-8 text-[12px]"
          >
            {emailRequestMutation.isPending && (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            )}
            {emailRequestMutation.isPending ? "Sending…" : "Send verification code"}
          </Button>
        </form>

        {account?.pending_email_change && (
          <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-black/5">
                <ShieldCheck className="h-4 w-4 text-black/50" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-black">Pending verification</p>
                <p className="text-[12px] text-black/50">
                  New email: {account.pending_email_change.new_email}
                </p>
                <p className="text-[11px] text-black/30 mt-0.5">
                  Expires {new Date(account.pending_email_change.expires_at).toLocaleString()}
                </p>
              </div>
            </div>
            <form onSubmit={handleEmailVerify} className="flex items-end gap-3">
              <div className="flex-1 max-w-[200px] space-y-1.5">
                <Label htmlFor="code" className="text-[12px] font-medium text-black/60">
                  Verification code
                </Label>
                <Input
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                  className="h-9 text-[13px] border-neutral-200"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={emailVerifyMutation.isPending}
                size="sm"
                className="h-9 text-[12px]"
              >
                {emailVerifyMutation.isPending && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Verify
              </Button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
