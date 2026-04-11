"use client";

import { useMemo, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: string | null;
  filename: string;
  contentType: string;
  loading?: boolean;
}

export function ReportPreviewModal({
  isOpen,
  onClose,
  reportData,
  filename,
  contentType,
  loading,
}: ReportPreviewModalProps) {
  const prevUrlRef = useRef<string | null>(null);

  const blobUrl = useMemo(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    if (!reportData) return null;
    const url = URL.createObjectURL(
      new Blob([Uint8Array.from(atob(reportData), (c) => c.charCodeAt(0))], {
        type: contentType,
      }),
    );
    prevUrlRef.current = url;
    return url;
  }, [reportData, contentType]);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 [&>button]:absolute [&>button]:right-4 [&>button]:bottom-4 [&>button]:top-auto [&>button]:left-auto [&>button]:rounded-full [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:opacity-100 [&>button]:h-10 [&>button]:w-10 [&>button]:p-0 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:shadow-lg [&>button]:hover:bg-primary/90">
        <VisuallyHidden>
          <DialogTitle>{filename || "Report Preview"}</DialogTitle>
        </VisuallyHidden>
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <p className="text-gray-500">Generating report...</p>
              </div>
            </div>
          ) : blobUrl ? (
            <iframe
              src={blobUrl}
              className="w-full h-full border-0 rounded-lg"
              title="Report Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No report to display</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
