import {
    BookOpen,
    ClipboardCheck,
    Clock,
    Folder,
    LayoutDashboard,
    ListTodo,
    Map,
    Store,
    UserCircle2,
    Users,
    Workflow,
    type LucideIcon
} from "lucide-react";

export interface SidebarNavItem {
    name: string;
    href?: string;
    activeMatchHrefs?: string[];
    icon?: LucideIcon;
    badge?: string;
    isDivider?: boolean;
    isExternal?: boolean;
    isDepartments?: boolean;
    isComingSoon?: boolean;
}

export const sidebarNavItems: SidebarNavItem[] = [
    // Section 1: Overview & Checklists
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Active Checklists",
        href: "/dashboard/checklists",
        icon: Clock,
    },
    {
        name: "Browse Checklists",
        href: "/dashboard/checklists/available",
        icon: ListTodo,
    },
    {
        name: "Marketplace",
        href: "/dashboard/templates",
        icon: Store,
    },
    // --- divider ---
    { name: "divider-1", isDivider: true },
    // Section 2: Management
    {
        name: "Workflows",
        href: "/dashboard/workflows",
        icon: Workflow,
    },
    {
        name: "Team Members",
        href: "/dashboard/team",
        icon: Users,
    },
    {
        name: "Locations",
        href: "/dashboard/sections",
        icon: Map,
    },
    {
        name: "Audits",
        href: "/dashboard/audits",
        icon: ClipboardCheck,
    },
    {
        name: "Departments",
        icon: Folder,
        isDepartments: true,
    },
    // --- divider ---
    { name: "divider-3", isDivider: true },
    // Section 3: Account & Resources
    {
        name: "Account",
        href: "/dashboard/account/settings",
        icon: UserCircle2,
    },
    {
        name: "Resources",
        href: "/dashboard/guidelines",
        icon: BookOpen,
    },
];
