"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckSquare,
  Building,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  Plus,
  Trash2,
} from "lucide-react";
import { useCompany } from "../../hooks/use-company";
import { useCompanies } from "../../hooks/use-companies";
import type { Company } from "@/lib/services/company/models";
import { updateCurrentCompanyAction } from "@/lib/services/company/actions";
import { useToast } from "@/hooks/use-toast";
import { sidebarNavItems } from "./data";
import { Account } from "@/lib/services/accounts/models";
import { ComingSoonDialog } from "@/components/ui/coming-soon-dialog";
import { getGroups } from "@/lib/services/groups";
import { buildGroupTree } from "@/lib/utils/group-tree";
import type { GroupTreeNode } from "@/lib/utils/group-tree";

type SidebarProps = {
  account: Account | undefined;
  mobile?: boolean;
};

function getActiveSidebarHref(pathname: string, items: typeof sidebarNavItems) {
  let bestMatch: string | null = null;

  for (const item of items) {
    if (item.href && pathname === item.href) return item.href;

    if (item.children) {
      for (const child of item.children) {
        if (child.href && pathname === child.href) return child.href;

        const isPrefixMatch =
          child.href && pathname.startsWith(child.href + "/");
        if (!isPrefixMatch) continue;

        if (
          !bestMatch ||
          (child.href && child.href.length > bestMatch.length)
        ) {
          bestMatch = child.href || null;
        }
      }
    }

    const isPrefixMatch = item.href && pathname.startsWith(item.href + "/");
    if (!isPrefixMatch) continue;

    if (!bestMatch || item.href!.length > bestMatch.length) {
      bestMatch = item.href || null;
    }
  }

  return bestMatch;
}

export function Sidebar({ account, mobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { data: companies = [], isLoading: loading, error } = useCompanies();
  const errorMessage = error instanceof Error ? error.message : null;

  const { currentCompany, currentCompanyId, setCurrentCompany } = useCompany();

  // State for managing expanded/collapsed sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  // State for managing expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Fetch groups
  const { data: groups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5,
  });

  // Build hierarchical group tree
  const groupTree = buildGroupTree(groups, (a, b) =>
    a.name.localeCompare(b.name),
  );

  // Get active group from URL
  const searchParams = new URLSearchParams(
    pathname.includes("?") ? pathname.split("?")[1] : "",
  );
  const activeGroupId = searchParams.get("group");
  const activeGroup =
    activeGroupId && activeGroupId !== "none"
      ? groups.find((g) => g.id === activeGroupId)
      : null;

  // Count ungrouped checklists
  const ungroupedCount = groups.reduce((sum, group) => {
    if (!group.parent_group_id || group.parent_group_id === "0") {
      return sum;
    }
    return sum;
  }, 0);

  // State for coming soon dialog
  const [comingSoonDialog, setComingSoonDialog] = useState<{
    open: boolean;
    featureName: string;
  }>({ open: false, featureName: "" });

  // State for group actions
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  // Initialize expanded sections based on defaultExpanded
  useEffect(() => {
    const defaultExpanded = new Set<string>();
    sidebarNavItems.forEach((item) => {
      if (item.defaultExpanded && item.collapsible) {
        defaultExpanded.add(item.name);
      }
    });
    setExpandedSections(defaultExpanded);
  }, []);

  // Initialize current company
  useEffect(() => {
    if (companies.length && !currentCompanyId) {
      const company =
        companies.find((c) => c.id === account?.current_company_id) ||
        companies[0];
      setCurrentCompany(company);
    }
  }, [
    companies,
    currentCompanyId,
    account?.current_company_id,
    setCurrentCompany,
  ]);

  const handleItemClick = (item: (typeof sidebarNavItems)[0]) => {
    const isItemCollapsible =
      item.collapsible && (item.children || item.isGroupsItem);

    // Show coming soon dialog for items with badges
    if (item.badge) {
      setComingSoonDialog({ open: true, featureName: item.name });
      return;
    }

    if (isItemCollapsible) {
      // Toggle expansion for collapsible items (including Groups)
      toggleSection(item.name);
    } else if (item.href) {
      if (item.isExternal) {
        // Open external links in a new window/tab
        window.open(item.href, "_blank");
      } else {
        // Navigate directly for non-collapsible items
        router.push(item.href);
      }
    }

    // Close mobile sidebar after navigation
    if (mobile && !isItemCollapsible) {
      // This will be handled by the parent component
      setTimeout(() => {
        const event = new CustomEvent("closeMobileSidebar");
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const renderGroupNode = (node: GroupTreeNode, depth: number = 0) => {
    const isExpanded = expandedGroups.has(node.group.id);
    const hasChildren = node.children.length > 0;
    const isActive =
      pathname === `/dashboard/checklists?group=${node.group.id}`;

    return (
      <React.Fragment key={node.group.id}>
        <div className="relative group/item">
          <Link
            href={`/dashboard/checklists?group=${node.group.id}`}
            className={cn(
              "flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors",
              isActive
                ? "bg-primary/5 text-primary"
                : "text-gray-600 hover:bg-gray-100",
            )}
            style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleGroup(node.group.id);
                }}
                className="mr-1 hover:bg-gray-200 rounded p-0.5"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
            {!hasChildren && <span className="w-4 mr-1" />}
            <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate flex-1">{node.group.name}</span>
            {node.group.no_of_checklists > 0 && (
              <span className="ml-auto text-xs text-gray-400">
                {node.group.no_of_checklists}
              </span>
            )}
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/dashboard/groups?delete=${node.group.id}`);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-100 rounded opacity-0 group-hover/item:opacity-100 transition-opacity"
            title="Delete Group"
          >
            <Trash2 className="w-3 h-3 text-red-600" />
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {node.children.map((child) => renderGroupNode(child, depth + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  const activeHref = useMemo(
    () => getActiveSidebarHref(pathname, sidebarNavItems),
    [pathname],
  );

  return (
    <div
      className={`flex flex-col w-64 bg-white border-r border-gray-200 ${
        mobile ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Logo - hidden on mobile since it's in the mobile sidebar header */}
      {!mobile && (
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Checkky</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {sidebarNavItems.map((item, itemIndex) => {
          const isExpanded = expandedSections.has(item.name);
          const isCollapsible =
            item.collapsible && (item.children || item.isGroupsItem);
          const isActive = item.href === activeHref;
          const isSectionHeader = item.isSectionHeader;

          // Check if any child item is active for section headers
          const hasActiveChild =
            isCollapsible &&
            item.children?.some((child) => child.href === activeHref);
          const isSectionActive = isActive || hasActiveChild;

          // Render section header
          if (isSectionHeader) {
            return (
              <div
                key={`${itemIndex}-${item.name}`}
                className={cn("mb-2", item.className)}
              >
                <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.name}
                </div>
              </div>
            );
          }

          return (
            <div key={`${itemIndex}-${item.name}`} className="space-y-1">
              <div
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer relative",
                  isSectionActive
                    ? "bg-primary/5 text-primary"
                    : "text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                )}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && (
                  <item.icon
                    className={cn(
                      "w-5 h-5 mr-3 flex-shrink-0",
                      isSectionActive ? "text-primary" : "text-gray-500",
                    )}
                  />
                )}
                <span className="truncate flex-1">
                  {item.name}
                  {item.isGroupsItem && activeGroup && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      / {activeGroup.name}
                    </span>
                  )}
                </span>
                {item.isGroupsItem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/dashboard/groups");
                    }}
                    className="ml-auto p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Manage Groups"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto text-xs px-2 py-0.5 rounded-full",
                      isSectionActive
                        ? "bg-primary/20 text-primary"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {isCollapsible && (
                  <span
                    className="ml-auto cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(item.name);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {isCollapsible && (
                <div
                  className={cn(
                    "relative space-y-1 transition-all duration-200 ease-in-out",
                    !isExpanded && "hidden",
                  )}
                >
                  {/* Vertical line connecting to children */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full ml-3" />

                  {/* Render hierarchical groups if this is the Groups item */}
                  {item.isGroupsItem ? (
                    <div className="ml-6 space-y-0.5">
                      {groupTree.map((node) => renderGroupNode(node))}
                      <Link
                        href="/dashboard/checklists?group=none"
                        className={cn(
                          "flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors",
                          pathname === "/dashboard/checklists?group=none"
                            ? "bg-primary/5 text-primary"
                            : "text-gray-600 hover:bg-gray-100",
                        )}
                      >
                        <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate flex-1">No Group</span>
                      </Link>
                    </div>
                  ) : (
                    item.children?.map((child, childIndex) => {
                      const isChildActive = child.href === activeHref;

                      return (
                        <Link
                          key={child.name}
                          href={child.href || "#"}
                          aria-current={isChildActive ? "page" : undefined}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors relative",
                            child.icon ? "ml-6" : "ml-10",
                            isChildActive
                              ? "text-primary"
                              : "text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          )}
                        >
                          {child.icon && (
                            <child.icon
                              className={cn(
                                "w-4 h-4 mr-3 flex-shrink-0",
                                isChildActive
                                  ? "text-primary"
                                  : "text-gray-400",
                              )}
                            />
                          )}
                          <span className="truncate">{child.name}</span>
                          {child.badge && (
                            <span
                              className={cn(
                                "ml-auto text-xs px-2 py-0.5 rounded-full",
                                isChildActive
                                  ? "bg-primary/20 text-primary"
                                  : "bg-gray-100 text-gray-600",
                              )}
                            >
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Company Switcher */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Company</span>
            {companies.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full ml-auto">
                {companies.length}
              </span>
            )}
          </div>

          {/* Company Selector */}
          <Select
            value={currentCompanyId || ""}
            onValueChange={async (companyId) => {
              const selectedCompany = companies.find((c) => c.id === companyId);
              if (!selectedCompany) return;

              try {
                const success = await updateCurrentCompanyAction(companyId);
                if (success) {
                  setCurrentCompany(selectedCompany);
                  toast({
                    title: "Company Switched",
                    description: `Switched to ${selectedCompany.name}`,
                  });
                  window.location.reload();
                } else {
                  toast({
                    title: "Error",
                    description: "Failed to switch company. Please try again.",
                    variant: "destructive",
                  });
                }
              } catch (error) {
                console.error("Failed to switch company:", error);
                toast({
                  title: "Error",
                  description: "Failed to switch company. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            disabled={loading}
          >
            <SelectTrigger className="w-full h-9 text-sm border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <SelectValue
                placeholder={
                  loading ? "Loading companies..." : "Select company"
                }
              />
            </SelectTrigger>
            <SelectContent className="min-w-[200px]">
              {loading && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    <span>Loading companies...</span>
                  </div>
                </div>
              )}
              {errorMessage && (
                <div className="p-3 text-sm text-red-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
              {!loading &&
                !errorMessage &&
                companies.map((company) => (
                  <SelectItem
                    key={company.id}
                    value={company.id}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 py-1">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="truncate font-medium">
                        {company.name}
                      </span>
                      {company.id === currentCompanyId && (
                        <span className="text-xs text-green-500 font-semibold">
                          ✓
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              {!loading && !errorMessage && companies.length === 0 && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span>📋</span>
                    <span>No companies available</span>
                  </div>
                </div>
              )}
            </SelectContent>
          </Select>

          {/* Current Company Display */}
          {currentCompany && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-700">
                  Active Company
                </span>
              </div>
              <div className="text-sm font-medium text-gray-800 truncate mt-1 pl-7">
                {currentCompany.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon Dialog */}
      <ComingSoonDialog
        open={comingSoonDialog.open}
        onOpenChange={(open) => setComingSoonDialog({ open, featureName: "" })}
        featureName={comingSoonDialog.featureName}
      />
    </div>
  );
}
