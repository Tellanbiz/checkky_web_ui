"use client";

import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CheckSquare } from "lucide-react";
import { useCompany } from "../../hooks/use-company";
import { useCompanies } from "../../hooks/use-companies";
import { updateCurrentCompanyAction } from "@/lib/services/company/actions";
import { useToast } from "@/hooks/use-toast";
import { Account } from "@/lib/services/accounts/models";
import { ComingSoonDialog } from "@/components/ui/coming-soon-dialog";
import { getGroups } from "@/lib/services/groups";
import { createGroup } from "@/lib/services/groups/post";
import { buildGroupTree } from "@/lib/utils/group-tree";
import { GroupDialog } from "@/components/groups/group-dialog";
import { SidebarRail } from "./sidebar-rail";
import { DepartmentPanel } from "./department-panel";
import { CompanySwitcher } from "./company-switcher";
import { sidebarNavItems } from "./data";
import { getWorkflows } from "@/lib/services/workflows/get";
import { getAssignedChecklists } from "@/lib/services/checklist/get";

type SidebarProps = {
  account: Account | undefined;
  mobile?: boolean;
};

function getActiveSidebarHref(pathname: string, items: typeof sidebarNavItems) {
  let bestMatch: string | null = null;

  for (const item of items) {
    const matchPaths = item.activeMatchHrefs?.length
      ? item.activeMatchHrefs
      : item.href
        ? [item.href]
        : [];

    if (matchPaths.some((path) => pathname === path)) {
      return item.href ?? matchPaths[0] ?? null;
    }

    const isPrefixMatch = matchPaths.some((path) => pathname.startsWith(path + "/"));
    if (!isPrefixMatch) continue;

    const itemHref = item.href ?? matchPaths[0] ?? null;
    if (!itemHref) continue;

    if (!bestMatch || itemHref.length > bestMatch.length) {
      bestMatch = itemHref;
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

  // Whether the department sub-sidebar is open
  const [deptPanelOpen, setDeptPanelOpen] = useState(false);

  // State for managing expanded groups inside dept panel
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // State for coming soon dialog
  const [comingSoonDialog, setComingSoonDialog] = useState<{
    open: boolean;
    featureName: string;
  }>({ open: false, featureName: "" });

  // State for group creation
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [parentGroupForNew, setParentGroupForNew] = useState<string>("");
  const [newGroupFormData, setNewGroupFormData] = useState({
    name: "",
    description: "none",
    parent_group_id: undefined as number | undefined,
  });

  // Fetch groups
  const { data: groups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5,
  });
  const { data: runningWorkflows = [] } = useQuery({
    queryKey: ["sidebar", "running-workflows-count"],
    queryFn: () => getWorkflows(undefined, "running"),
    staleTime: 1000 * 60,
  });
  const { data: pendingChecklists = [] } = useQuery({
    queryKey: ["sidebar", "pending-checklists-count"],
    queryFn: getAssignedChecklists,
    staleTime: 1000 * 60,
    select: (data) => data.filter((checklist) => checklist.status === "pending"),
  });

  const queryClient = useQueryClient();

  const groupTree = buildGroupTree(groups, (a, b) =>
    a.name.localeCompare(b.name),
  );

  // Mutation for creating a department
  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setShowCreateGroupDialog(false);
      setNewGroupFormData({
        name: "",
        description: "none",
        parent_group_id: undefined,
      });
      setParentGroupForNew("");
      toast({
        title: "Success",
        description: "Department created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      });
    },
  });

  const handleCreateSubgroup = (parentGroupId: string) => {
    setParentGroupForNew(parentGroupId);
    setNewGroupFormData({
      name: "",
      description: "none",
      parent_group_id: parseInt(parentGroupId),
    });
    setShowCreateGroupDialog(true);
  };

  const handleCreateRoot = () => {
    setNewGroupFormData({
      name: "",
      description: "none",
      parent_group_id: undefined,
    });
    setParentGroupForNew("");
    setShowCreateGroupDialog(true);
  };

  const handleSubmitNewGroup = () => {
    if (!newGroupFormData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }
    createGroupMutation.mutate(newGroupFormData);
  };

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

  const handleCompanySwitch = async (companyId: string) => {
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

  const activeHref = useMemo(
    () => getActiveSidebarHref(pathname, sidebarNavItems),
    [pathname],
  );
  const resolvedNavItems = useMemo(
    () =>
      sidebarNavItems.map((item) => {
        if (item.name === "Workflows") {
          return {
            ...item,
            badge: runningWorkflows.length > 0 ? String(runningWorkflows.length) : undefined,
          };
        }
        if (item.name === "Active Checklists") {
          return {
            ...item,
            badge: pendingChecklists.length > 0 ? String(pendingChecklists.length) : undefined,
          };
        }
        return item;
      }),
    [pendingChecklists.length, runningWorkflows.length],
  );

  const handleItemClick = (item: (typeof sidebarNavItems)[number]) => {
    if (item.isComingSoon) {
      setComingSoonDialog({ open: true, featureName: item.name });
      return;
    }

    if (item.isDepartments) {
      setDeptPanelOpen((prev) => !prev);
      return;
    }

    setDeptPanelOpen(false);

    if (item.href) {
      if (item.isExternal) {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
    }

    if (mobile) {
      setTimeout(() => {
        const event = new CustomEvent("closeMobileSidebar");
        window.dispatchEvent(event);
      }, 100);
    }
  };

  // Shared dialogs rendered once
  const dialogs = (
    <>
      <ComingSoonDialog
        open={comingSoonDialog.open}
        onOpenChange={(open) => setComingSoonDialog({ open, featureName: "" })}
        featureName={comingSoonDialog.featureName}
      />
      <GroupDialog
        isOpen={showCreateGroupDialog}
        onClose={() => {
          setShowCreateGroupDialog(false);
          setNewGroupFormData({
            name: "",
            description: "none",
            parent_group_id: undefined,
          });
          setParentGroupForNew("");
        }}
        onSubmit={handleSubmitNewGroup}
        title="Create Department"
        submitText="Create"
        formData={{
          name: newGroupFormData.name,
          description: "none",
          color: "",
          parent_group_id: parentGroupForNew,
        }}
        onFormDataChange={(data) => {
          setNewGroupFormData({
            name: data.name,
            description: "none",
            parent_group_id: data.parent_group_id
              ? parseInt(data.parent_group_id)
              : undefined,
          });
        }}
        isPending={createGroupMutation.isPending}
        groups={groups}
        currentGroupId={null}
      />
    </>
  );

  // Department panel open: rail + animated sub-panel
  if (deptPanelOpen && !mobile) {
    return (
      <TooltipProvider delayDuration={0}>
        <div className="hidden md:flex relative h-full min-h-0 items-stretch bg-white">
          <SidebarRail
            activeHref={activeHref}
            items={resolvedNavItems}
            onItemClick={handleItemClick}
          />
          <div className="h-full min-h-0 animate-in slide-in-from-left-2 duration-200 ease-out">
            <DepartmentPanel
              groupTree={groupTree}
              expandedGroups={expandedGroups}
              onToggleGroup={toggleGroup}
              onCreateSubgroup={handleCreateSubgroup}
              onCreateRoot={handleCreateRoot}
              onClose={() => setDeptPanelOpen(false)}
            />
          </div>
          {dialogs}
        </div>
      </TooltipProvider>
    );
  }

  // Normal expanded sidebar
  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex h-full min-h-0 flex-col w-[220px] bg-white border-r border-gray-100",
          mobile ? "flex" : "hidden md:flex",
        )}
      >
        {/* Logo */}
        {!mobile && (
          <div className="flex items-center h-16 px-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#16A34A] rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckSquare className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[15px] font-bold text-gray-900 tracking-tight">
                Checkky
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
          {resolvedNavItems.map((item, idx) => {
            if (item.isDivider) {
              return (
                <div
                  key={`${idx}-${item.name}`}
                  className="my-4 border-t border-neutral-100"
                />
              );
            }

            const isActive = item.href === activeHref;
            const isDeptActive = item.isDepartments && deptPanelOpen;
            const isCurrent = isActive || isDeptActive;

            return (
              <div
                key={`${idx}-${item.name}`}
                className={cn(
                  "flex items-center gap-3 py-[6px] text-[13.5px] text-black cursor-pointer",
                  isCurrent ? "font-semibold" : "font-normal",
                )}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && (
                  <item.icon
                    className="h-4 w-4 shrink-0 text-black/60"
                    strokeWidth={isCurrent ? 2 : 1.5}
                  />
                )}
                <span className="truncate flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-md bg-neutral-200 px-1.5 text-[10px] font-medium leading-none text-black tabular-nums">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Company Switcher */}
        <CompanySwitcher
          companies={companies}
          currentCompany={currentCompany}
          currentCompanyId={currentCompanyId}
          loading={loading}
          errorMessage={errorMessage}
          onSwitch={handleCompanySwitch}
        />

        {dialogs}
      </div>
    </TooltipProvider>
  );
}
