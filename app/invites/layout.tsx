import { QueryProvider } from "@/lib/shared/query_provider";
import { Toaster } from "@/components/ui/toaster";

export default function InvitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      {children}
      <Toaster />
    </QueryProvider>
  );
}
