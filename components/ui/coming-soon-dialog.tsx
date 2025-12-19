"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Mail } from "lucide-react";

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
}

export function ComingSoonDialog({
  open,
  onOpenChange,
  featureName,
}: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            {featureName} - In Development
          </DialogTitle>
          <DialogDescription className="text-base">
            This feature is currently under development and will be available
            soon. We're working hard to bring you the best experience possible.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-2">
              What to expect:
            </h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Enhanced audit workflows</li>
              <li>• Comprehensive reporting tools</li>
              <li>• Team collaboration features</li>
              <li>• Advanced analytics dashboard</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Stay updated:</h4>
            <p className="text-sm text-blue-700 mb-3">
              Get notified when this feature launches. Contact our team for
              early access opportunities.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.open(
                  "mailto:info@checkky.com?subject=Early Access Request - " +
                    featureName,
                  "_blank"
                );
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Request Early Access
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Got it, thanks!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
