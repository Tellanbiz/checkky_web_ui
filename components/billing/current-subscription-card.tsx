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
import { CreditCard, Loader2, AlertCircle } from "lucide-react";

type StripeSubscription = any;

interface CurrentSubscriptionCardProps {
  subscription: StripeSubscription | null;
  busyAction: "checkout" | "portal" | "cancel" | null;
  onCancel: () => void;
  onManage: () => void;
}

export function CurrentSubscriptionCard({
  subscription,
  busyAction,
  onCancel,
  onManage,
}: CurrentSubscriptionCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "trialing":
        return "secondary";
      case "past_due":
        return "destructive";
      case "canceled":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span>Current Subscription</span>
        </CardTitle>
        <CardDescription>
          Manage your active subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription ? (
          <>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Current Plan
                  </div>
                  <div className="text-lg font-semibold">
                    {subscription.items?.data?.[0]?.price?.product?.name ||
                      subscription.plan?.product?.name ||
                      subscription.plan?.nickname ||
                      "Subscription Plan"}
                  </div>
                  {subscription.items?.data?.[0]?.price?.unit_amount && (
                    <div className="text-sm text-muted-foreground">
                      $
                      {(
                        subscription.items.data[0].price.unit_amount / 100
                      ).toFixed(2)}
                      /
                      {subscription.items.data[0].price.recurring?.interval ||
                        "month"}
                    </div>
                  )}
                </div>
                <Badge variant={getStatusVariant(subscription.status)}>
                  {String(subscription.status)}
                </Badge>
              </div>

              {subscription.current_period_end && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Current Period Ends
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(
                      subscription.current_period_end * 1000
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              )}

              {subscription.cancel_at_period_end && (
                <div className="flex items-start space-x-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-orange-800">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Cancellation Scheduled</div>
                    <div className="text-xs mt-1">
                      Your subscription will end at the current period end date.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={
                  busyAction !== null || subscription.cancel_at_period_end
                }
              >
                {busyAction === "cancel" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Cancel Subscription
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={onManage}
                disabled={busyAction !== null}
              >
                {busyAction === "portal" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Manage in Stripe
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium mb-1">
              No Active Subscription
            </div>
            <div className="text-xs text-muted-foreground">
              Choose a plan below to get started
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
