import {
    Archive,
    Book,
    Building2,
    CheckCircle,
    ClipboardCheck,
    Clock,
    CreditCard,
    Folder,
    FolderOpen,
    HelpCircle,
    LayoutDashboard,
    ListTodo,
    Mail,
    Map,
    MoreHorizontal,
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
    isGroupsItem?: boolean;
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
        name: "My Checklists",
        href: "/dashboard/checklists",
        icon: ListTodo,
        collapsible: true,
        defaultExpanded: true,
        children: [
            {
                name: "Ongoing Checklists",
                href: "/dashboard/checklists",
                icon: Clock,
            },
            {
                name: "Available Checklists",
                href: "/dashboard/checklists/available",
                icon: ListTodo,
            },

            {
                name: "Available Templates",
                href: "/dashboard/templates",
                icon: Book,
            },
        ],
    },
    {
        name: "Team Members",
        icon: Users,
        href: "/dashboard/team",
    },
    {
        name: "Workflow Automation",
        href: "/dashboard/workflows",
        icon: Workflow,
    },
    {
        name: "Location Management",
        href: "/dashboard/sections",
        icon: Map,
    },
    {
        name: "Audit Management",
        href: "/dashboard/audits",
        icon: ClipboardCheck,
    },
    {
        name: "Groups",
        isSectionHeader: true,
        className: "pt-6",
    },
    {
        name: "Groups",
        icon: Folder,
        collapsible: true,
        defaultExpanded: true,
        isGroupsItem: true,
        children: [],
    },
];