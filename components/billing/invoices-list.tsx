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
import { ReceiptText, ExternalLink, FileText } from "lucide-react";

type StripeInvoice = any;

interface InvoicesListProps {
  invoices: StripeInvoice[];
}

export function InvoicesList({ invoices }: InvoicesListProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "open":
        return "secondary";
      case "void":
      case "uncollectible":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const dollars = amount / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
    }).format(dollars);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ReceiptText className="h-5 w-5 text-primary" />
          <span>Invoice History</span>
        </CardTitle>
        <CardDescription>
          View and download your recent billing invoices from Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium mb-1">No Invoices Yet</div>
            <div className="text-xs text-muted-foreground">
              Your billing invoices will appear here once you subscribe
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.slice(0, 10).map((inv: any) => (
              <div
                key={inv?.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium">
                      {inv?.number || `Invoice ${inv?.id?.substring(0, 8)}`}
                    </div>
                    <Badge
                      variant={getStatusVariant(inv?.status)}
                      className="text-xs"
                    >
                      {inv?.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    {inv?.created && <span>{formatDate(inv.created)}</span>}
                    <span>•</span>
                    <span className="font-medium text-foreground">
                      {formatAmount(
                        inv?.amount_paid ?? inv?.amount_due ?? 0,
                        inv?.currency
                      )}
                    </span>
                  </div>
                </div>
                {inv?.hosted_invoice_url ? (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={inv.hosted_invoice_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      View
                    </a>
                  </Button>
                ) : inv?.invoice_pdf ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={inv.invoice_pdf} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      PDF
                    </a>
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
