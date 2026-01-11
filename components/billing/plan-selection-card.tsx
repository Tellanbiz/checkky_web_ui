"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Crown, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import type { BillingPlan } from "@/lib/services/billing/data";

interface PlanSelectionCardProps {
  plans: BillingPlan[];
  selectedPlanId: string;
  selectedPlan: BillingPlan | null;
  currentPlanPriceId?: string | null;
  currentPlanPrice?: number | null;
  busyAction: "checkout" | "portal" | "cancel" | null;
  onPlanChange: (planId: string) => void;
  onCheckout: () => void;
}

export function PlanSelectionCard({
  plans,
  selectedPlanId,
  selectedPlan,
  currentPlanPriceId,
  currentPlanPrice,
  busyAction,
  onPlanChange,
  onCheckout,
}: PlanSelectionCardProps) {
  const isCurrentPlan =
    !!selectedPlan &&
    !!currentPlanPriceId &&
    selectedPlan.stripe_id === currentPlanPriceId;

  const actionLabel = (() => {
    if (!selectedPlan) return "Subscribe Now";
    if (!currentPlanPriceId) return "Subscribe Now";
    if (isCurrentPlan) return "Current Plan";
    if (typeof currentPlanPrice === "number") {
      if (selectedPlan.price > currentPlanPrice) return "Upgrade";
      if (selectedPlan.price < currentPlanPrice) return "Downgrade";
    }
    return "Change Plan";
  })();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-primary" />
          <span>Choose a Plan</span>
        </CardTitle>
        <CardDescription>
          Select a subscription plan and start with Stripe Checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Crown className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium mb-1">No Plans Available</div>
            <div className="text-xs text-muted-foreground">
              Contact support to configure subscription plans
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Plan</label>
              <Select value={selectedPlanId} onValueChange={onPlanChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">
                          ${p.price.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {p.no_of_members > 0
                            ? `${p.no_of_members} members`
                            : "Custom"}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlan && (
              <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      ${selectedPlan.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      per billing period
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {selectedPlan.stripe_id.substring(0, 20)}...
                  </Badge>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Plan Includes
                  </div>
                  <div className="grid gap-2">
                    {selectedPlan.no_of_checklist > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>
                          <span className="font-medium">
                            {selectedPlan.no_of_checklist}
                          </span>{" "}
                          Checklists
                        </span>
                      </div>
                    )}
                    {selectedPlan.no_of_members > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>
                          <span className="font-medium">
                            {selectedPlan.no_of_members}
                          </span>{" "}
                          Team Members
                        </span>
                      </div>
                    )}
                    {selectedPlan.no_of_companies > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>
                          <span className="font-medium">
                            {selectedPlan.no_of_companies}
                          </span>{" "}
                          Companies
                        </span>
                      </div>
                    )}
                    {selectedPlan.no_of_checklist === 0 &&
                      selectedPlan.no_of_members === 0 &&
                      selectedPlan.no_of_companies === 0 && (
                        <div className="text-sm text-muted-foreground">
                          Custom plan limits - contact support for details
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={onCheckout}
              disabled={!selectedPlan || busyAction !== null || isCurrentPlan}
              className="w-full"
              size="lg"
            >
              {busyAction === "checkout" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              {actionLabel}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
