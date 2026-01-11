"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

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
import { CurrentSubscriptionCard } from "@/components/billing/current-subscription-card";
import { PlanSelectionCard } from "@/components/billing/plan-selection-card";
import { InvoicesList } from "@/components/billing/invoices-list";

type StripeSubscription = any;
type StripeInvoice = any;

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<StripeSubscription[]>([]);
  const [invoices, setInvoices] = useState<StripeInvoice[]>([]);

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [busyAction, setBusyAction] = useState<
    "checkout" | "portal" | "cancel" | null
  >(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [plansRes, subsRes, invoicesRes] = await Promise.all([
          getAvailablePlans(),
          getCurrentSubscription(),
          getInvoices(),
        ]);

        setPlans(plansRes.plans ?? []);
        setSubscriptions(subsRes?.subscriptions ?? []);
        setInvoices(invoicesRes?.invoices ?? []);

        if ((plansRes.plans ?? []).length > 0) {
          setSelectedPlanId(plansRes.plans[0].id);
        }
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load billing data"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const activeSubscription = useMemo(() => {
    const all = subscriptions ?? [];
    return (
      all.find(
        (s) =>
          s?.status === "active" ||
          s?.status === "trialing" ||
          s?.status === "past_due"
      ) ??
      all[0] ??
      null
    );
  }, [subscriptions]);

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) ?? null;
  }, [plans, selectedPlanId]);

  const currentPriceId =
    activeSubscription?.items?.data?.[0]?.price?.id ?? null;
  const currentPriceAmount =
    typeof activeSubscription?.items?.data?.[0]?.price?.unit_amount === "number"
      ? activeSubscription.items.data[0].price.unit_amount / 100
      : null;

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    try {
      setBusyAction("checkout");
      setError(null);

      const origin = window.location.origin;
      const res = await createCheckoutSession({
        price_id: selectedPlan.stripe_id,
        quantity: 1,
        success_url: `${origin}/dashboard/billing?status=success`,
        cancel_url: `${origin}/dashboard/billing?status=cancel`,
      });

      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start checkout");
    } finally {
      setBusyAction(null);
    }
  };

  const handlePortal = async () => {
    try {
      setBusyAction("portal");
      setError(null);

      const origin = window.location.origin;
      const res = await createPortalSession({
        return_url: `${origin}/dashboard/billing`,
      });

      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to open billing portal"
      );
    } finally {
      setBusyAction(null);
    }
  };

  const handleCancel = async () => {
    if (!activeSubscription?.id) return;
    const ok = window.confirm(
      "Cancel your subscription at the end of the billing period?"
    );
    if (!ok) return;

    try {
      setBusyAction("cancel");
      setError(null);

      await cancelSubscription({
        subscription_id: activeSubscription.id,
        cancel_at_period_end: true,
        cancel_immediately: false,
      });

      const subsRes = await getCurrentSubscription();
      setSubscriptions(subsRes?.subscriptions ?? []);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to cancel subscription"
      );
    } finally {
      setBusyAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading billing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              Billing & Subscriptions
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage your subscription plans and billing information
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <CurrentSubscriptionCard
          subscription={activeSubscription}
          busyAction={busyAction}
          onCancel={handleCancel}
          onManage={handlePortal}
        />

        <PlanSelectionCard
          plans={plans}
          selectedPlanId={selectedPlanId}
          selectedPlan={selectedPlan}
          busyAction={busyAction}
          currentPlanPriceId={currentPriceId}
          currentPlanPrice={currentPriceAmount}
          onPlanChange={setSelectedPlanId}
          onCheckout={handleCheckout}
        />
      </div>

      <InvoicesList invoices={invoices} />
    </div>
  );
}
