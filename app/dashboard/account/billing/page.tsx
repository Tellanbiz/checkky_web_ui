"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Crown,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

import type { BillingPlan } from "@/lib/services/billing/data";
import {
  getAvailablePlans,
  getCurrentSubscription,
  getInvoices,
} from "@/lib/services/billing/get";
import {
  cancelSubscription,
  createCheckoutSession,
  createPortalSession,
} from "@/lib/services/billing/post";

type StripeSubscription = any;

export default function BillingPage() {
  const queryClient = useQueryClient();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [busyAction, setBusyAction] = useState<
    "checkout" | "portal" | "cancel" | null
  >(null);

  const {
    data: plansData,
    isLoading: plansLoading,
    error: plansError,
  } = useQuery({
    queryKey: ["billing-plans"],
    queryFn: getAvailablePlans,
    staleTime: 1000 * 60 * 10,
  });

  const { data: subsData, isLoading: subsLoading } = useQuery({
    queryKey: ["billing-subscription"],
    queryFn: getCurrentSubscription,
    staleTime: 1000 * 60 * 5,
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["billing-invoices"],
    queryFn: getInvoices,
    staleTime: 1000 * 60 * 5,
  });

  const plans: BillingPlan[] = plansData?.plans ?? [];
  const subscriptions: StripeSubscription[] = subsData?.subscriptions ?? [];
  const invoices: any[] = invoicesData?.invoices ?? [];

  // Auto-select first plan
  const effectivePlanId =
    selectedPlanId || (plans.length > 0 ? plans[0].id : "");

  const activeSubscription = useMemo(() => {
    return (
      subscriptions.find(
        (s: StripeSubscription) =>
          s?.status === "active" ||
          s?.status === "trialing" ||
          s?.status === "past_due",
      ) ??
      subscriptions[0] ??
      null
    );
  }, [subscriptions]);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === effectivePlanId) ?? null,
    [plans, effectivePlanId],
  );

  const currentPriceId =
    activeSubscription?.items?.data?.[0]?.price?.id ?? null;
  const currentPriceAmount =
    typeof activeSubscription?.items?.data?.[0]?.price?.unit_amount === "number"
      ? activeSubscription.items.data[0].price.unit_amount / 100
      : null;

  const isCurrentPlan =
    !!selectedPlan &&
    !!currentPriceId &&
    selectedPlan.stripe_id === currentPriceId;

  const actionLabel = (() => {
    if (!selectedPlan) return "Subscribe Now";
    if (!currentPriceId) return "Subscribe Now";
    if (isCurrentPlan) return "Current Plan";
    if (typeof currentPriceAmount === "number") {
      if (selectedPlan.price > currentPriceAmount) return "Upgrade";
      if (selectedPlan.price < currentPriceAmount) return "Downgrade";
    }
    return "Change Plan";
  })();

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    try {
      setBusyAction("checkout");
      const origin = window.location.origin;
      const res = await createCheckoutSession({
        price_id: selectedPlan.stripe_id,
        quantity: 1,
        success_url: `${origin}/dashboard/account/billing?status=success`,
        cancel_url: `${origin}/dashboard/account/billing?status=cancel`,
      });
      if (res?.url) window.location.href = res.url;
    } catch (e) {
      toast({
        title: "Error",
        description:
          e instanceof Error ? e.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handlePortal = async () => {
    try {
      setBusyAction("portal");
      const origin = window.location.origin;
      const res = await createPortalSession({
        return_url: `${origin}/dashboard/account/billing`,
      });
      if (res?.url) window.location.href = res.url;
    } catch (e) {
      toast({
        title: "Error",
        description:
          e instanceof Error ? e.message : "Failed to open billing portal",
        variant: "destructive",
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleCancel = async () => {
    if (!activeSubscription?.id) return;
    const ok = window.confirm(
      "Cancel your subscription at the end of the billing period?",
    );
    if (!ok) return;
    try {
      setBusyAction("cancel");
      await cancelSubscription({
        subscription_id: activeSubscription.id,
        cancel_at_period_end: true,
        cancel_immediately: false,
      });
      queryClient.invalidateQueries({ queryKey: ["billing-subscription"] });
    } catch (e) {
      toast({
        title: "Error",
        description:
          e instanceof Error ? e.message : "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setBusyAction(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
      case "paid":
        return "default" as const;
      case "trialing":
      case "open":
        return "secondary" as const;
      case "past_due":
      case "void":
      case "uncollectible":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
    }).format(amount / 100);

  const formatDate = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const isLoading = plansLoading || subsLoading || invoicesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-black/30" />
        <span className="ml-2 text-[13px] text-black/40">Loading billing…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current subscription */}
      <section>
        <div className="mb-4">
          <h2 className="text-[15px] font-semibold text-black">
            Current subscription
          </h2>
          <p className="text-[13px] text-black/40 mt-0.5">
            Your active plan and billing period details.
          </p>
        </div>

        {activeSubscription ? (
          <div className="rounded-lg border border-neutral-200 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-black/40 uppercase tracking-wider">
                  Plan
                </p>
                <p className="text-lg font-semibold text-black mt-0.5">
                  {activeSubscription.items?.data?.[0]?.price?.product?.name ||
                    activeSubscription.plan?.product?.name ||
                    activeSubscription.plan?.nickname ||
                    "Subscription Plan"}
                </p>
                {activeSubscription.items?.data?.[0]?.price?.unit_amount && (
                  <p className="text-[13px] text-black/50 mt-0.5">
                    $
                    {(
                      activeSubscription.items.data[0].price.unit_amount / 100
                    ).toFixed(2)}
                    /
                    {activeSubscription.items.data[0].price.recurring
                      ?.interval || "month"}
                  </p>
                )}
              </div>
              <Badge variant={getStatusVariant(activeSubscription.status)}>
                {String(activeSubscription.status)}
              </Badge>
            </div>

            {activeSubscription.current_period_end && (
              <div className="rounded-md bg-neutral-50 px-3 py-2.5">
                <p className="text-[11px] font-medium text-black/40 uppercase tracking-wider">
                  Period ends
                </p>
                <p className="text-[13px] font-medium text-black mt-0.5">
                  {new Date(
                    activeSubscription.current_period_end * 1000,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            {activeSubscription.cancel_at_period_end && (
              <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2.5 text-[13px] text-orange-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Cancellation scheduled — ends at current period.
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[12px]"
                onClick={handleCancel}
                disabled={
                  busyAction !== null || activeSubscription.cancel_at_period_end
                }
              >
                {busyAction === "cancel" && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Cancel subscription
              </Button>
              <Button
                size="sm"
                className="h-8 text-[12px]"
                onClick={handlePortal}
                disabled={busyAction !== null}
              >
                {busyAction === "portal" ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                )}
                Manage in Stripe
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 py-12 text-center">
            <CreditCard className="h-6 w-6 text-black/20 mb-2" />
            <p className="text-[13px] font-medium text-black/60">
              No active subscription
            </p>
            <p className="text-[12px] text-black/30 mt-0.5">
              Choose a plan below to get started.
            </p>
          </div>
        )}
      </section>

      <div className="border-t border-neutral-100" />

      {/* Choose a plan */}
      <section>
        <div className="mb-4">
          <h2 className="text-[15px] font-semibold text-black flex items-center gap-2">
            <Crown className="h-4 w-4 text-black/50" />
            Choose a plan
          </h2>
          <p className="text-[13px] text-black/40 mt-0.5">
            Select a subscription plan and check out via Stripe.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 py-12 text-center">
            <Crown className="h-6 w-6 text-black/20 mb-2" />
            <p className="text-[13px] font-medium text-black/60">
              No plans available
            </p>
            <p className="text-[12px] text-black/30 mt-0.5">
              Contact support to configure plans.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-w-sm space-y-1.5">
              <Label className="text-[12px] font-medium text-black/60">
                Select plan
              </Label>
              <Select value={effectivePlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger className="h-9 text-[13px] border-neutral-200">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-[13px]">
                      <span className="font-medium">${p.price.toFixed(2)}</span>
                      <span className="text-black/40 ml-2">
                        {p.no_of_members > 0
                          ? `${p.no_of_members} members`
                          : "Custom"}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlan && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-black">
                      ${selectedPlan.price.toFixed(2)}
                    </span>
                    <span className="text-[12px] text-black/40 ml-1">
                      / billing period
                    </span>
                  </div>
                  {isCurrentPlan && (
                    <Badge variant="secondary" className="text-[10px]">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="border-t border-neutral-200 pt-3 space-y-2">
                  <p className="text-[11px] font-medium text-black/40 uppercase tracking-wider">
                    Includes
                  </p>
                  <div className="grid gap-1.5">
                    {selectedPlan.no_of_checklist > 0 && (
                      <div className="flex items-center gap-2 text-[13px] text-black/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        <span>
                          <span className="font-medium">
                            {selectedPlan.no_of_checklist}
                          </span>{" "}
                          Checklists
                        </span>
                      </div>
                    )}
                    {selectedPlan.no_of_members > 0 && (
                      <div className="flex items-center gap-2 text-[13px] text-black/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        <span>
                          <span className="font-medium">
                            {selectedPlan.no_of_members}
                          </span>{" "}
                          Team Members
                        </span>
                      </div>
                    )}
                    {selectedPlan.no_of_companies > 0 && (
                      <div className="flex items-center gap-2 text-[13px] text-black/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        <span>
                          <span className="font-medium">
                            {selectedPlan.no_of_companies}
                          </span>{" "}
                          Companies
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={!selectedPlan || busyAction !== null || isCurrentPlan}
              size="sm"
              className="h-9 text-[12px] px-5"
            >
              {busyAction === "checkout" ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <CreditCard className="mr-1.5 h-3.5 w-3.5" />
              )}
              {actionLabel}
            </Button>
          </div>
        )}
      </section>

      <div className="border-t border-neutral-100" />

      {/* Invoices */}
      <section>
        <div className="mb-4">
          <h2 className="text-[15px] font-semibold text-black">
            Invoice history
          </h2>
          <p className="text-[13px] text-black/40 mt-0.5">
            Recent invoices from your Stripe billing.
          </p>
        </div>

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 py-12 text-center">
            <FileText className="h-6 w-6 text-black/20 mb-2" />
            <p className="text-[13px] font-medium text-black/60">
              No invoices yet
            </p>
            <p className="text-[12px] text-black/30 mt-0.5">
              Invoices appear here once you subscribe.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {invoices.slice(0, 10).map((inv: any) => (
              <div
                key={inv?.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:bg-neutral-50"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-black">
                      {inv?.number || `Invoice ${inv?.id?.substring(0, 8)}`}
                    </span>
                    <Badge
                      variant={getStatusVariant(inv?.status)}
                      className="text-[10px] h-5"
                    >
                      {inv?.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-black/40">
                    {inv?.created && <span>{formatDate(inv.created)}</span>}
                    <span>·</span>
                    <span className="font-medium text-black/60">
                      {formatAmount(
                        inv?.amount_paid ?? inv?.amount_due ?? 0,
                        inv?.currency,
                      )}
                    </span>
                  </div>
                </div>
                {(inv?.hosted_invoice_url || inv?.invoice_pdf) && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[12px]"
                  >
                    <a
                      href={inv.hosted_invoice_url || inv.invoice_pdf}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
