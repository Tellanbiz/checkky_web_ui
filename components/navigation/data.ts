import {
    Archive,
    Book,
    Building2,
    ClipboardCheck,
    CreditCard,
    FolderOpen,
    HelpCircle,
    LayoutDashboard,
    ListTodo,
    Mail,
    Map,
    UserCircle,
    Users,
    Workflow,
    ChevronRight,
    type LucideIcon
} from "lucide-react";

export interface SidebarNavItem {
    name: string;
    href?: string;
    icon?: LucideIcon;
    badge?: string;
    children?: SidebarNavItem[];
    collapsible?: boolean;
    defaultExpanded?: boolean;
    isSectionHeader?: boolean;
    className?: string;
    isExternal?: boolean;
}

export const sidebarNavItems: SidebarNavItem[] = [
    {
        name: "General",
        isSectionHeader: true,
    },
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Checklist Management",
        icon: ListTodo,
        collapsible: true,
        defaultExpanded: false,
        children: [
            {
                name: "My Checklist",
                href: "/dashboard/checklists",
            },
            {
                name: "Checklist Groups",
                href: "/dashboard/groups",
            },
            {
                name: "Available Templates",
                href: "/dashboard/checklists/available",
            },
            {
                name: "Template Library",
                href: "/dashboard/templates",
            },
        ],
    },
    {
        name: "Workflow Automation",
        icon: Workflow,
        collapsible: false,
        href: "/dashboard/workflows",
    },
    {
        name: "Location Management",
        icon: Map,
        collapsible: false,
        href: "/dashboard/sections",
    },
    {
        name: "Team Administration",
        icon: Users,
        collapsible: true,
        defaultExpanded: false,
        children: [
            {
                name: "Team Members",
                href: "/dashboard/team",
            },
            {
                name: "Team Invites",
                href: "/dashboard/team/invites",
            },
        ],
    },
    {
        name: "Audit Management",
        icon: ClipboardCheck,
        collapsible: true,
        defaultExpanded: false,
        href: "/dashboard/audits",
    },
    {
        name: "Account Settings",
        isSectionHeader: true,
        className: "pt-6",
    },
    {
        name: "Payments and Billing",
        icon: CreditCard,
        collapsible: false,
        href: "/dashboard/billing",
    },
    {
        name: "My Workspaces",
        icon: Building2,
        collapsible: false,
        href: "/dashboard/companies",
    },
    {
        name: "Documentation",
        icon: Book,
        collapsible: false,
        href: "/dashboard/docs",
        badge: "In Development",
    },
    {
        name: "Help & Support",
        icon: HelpCircle,
        collapsible: false,
        href: "mailto:info@checkky.com",
        isExternal: true,
    },
];