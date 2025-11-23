"use client";

import { Settings, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sidebar } from "../../../components/navigation/sidebar";
import { useEffect, useState } from "react";
import { getClientAccount } from "@/lib/services/auth/client-auth";
import { Account } from "@/lib/services/accounts/models";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const accountData = await getClientAccount();
        setAccount(accountData);
      } catch (error) {
        console.error("Failed to fetch account:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  // Get initials from full name
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter((segment) => segment);
    const breadcrumbs = [];

    // Add Dashboard as the first item
    breadcrumbs.push({
      label: "Dashboard",
      href: "/dashboard",
      isCurrent: pathname === "/dashboard",
    });

    // Add other segments
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      const href = "/" + segments.slice(0, i + 1).join("/");
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      breadcrumbs.push({
        label,
        href,
        isCurrent: i === segments.length - 1,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleLogout = async () => {
    try {
      // Delete the access_token cookie
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      // Redirect to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-gray-200 shadow-sm">
      {/* Left: Breadcrumb and Mobile menu */}
      <div className="flex items-center gap-4">
        {/* Breadcrumb - hidden on mobile */}
        <div className="hidden md:block">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.href} className="flex items-center">
                  <BreadcrumbItem>
                    {breadcrumb.isCurrent ? (
                      <BreadcrumbPage className="text-gray-900 font-medium">
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={breadcrumb.href}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="text-gray-400" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar account={account || undefined} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Right: User Menu */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 px-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 leading-none">
                    {loading ? "Loading..." : account?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {loading ? "..." : "Admin"}
                  </p>
                </div>
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage
                    src={account?.picture || "/placeholder-user.jpg"}
                    alt={account?.full_name || "User"}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {loading
                      ? "..."
                      : account
                      ? getInitials(account.full_name)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-2 py-2">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-semibold text-gray-900">
                  {loading
                    ? "Loading..."
                    : account?.full_name || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  {loading ? "..." : account?.email || "No email"}
                </p>
                <Badge
                  variant="secondary"
                  className="w-fit mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  Admin
                </Badge>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer hover:bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
