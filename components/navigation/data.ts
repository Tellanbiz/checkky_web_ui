import {
    Archive,
    Building2,
    FolderOpen,
    LayoutDashboard,
    ListTodo,
    Mail,
    Map,
    UserCircle,
    Users,
    Workflow,
    type LucideIcon
} from "lucide-react";

export interface SidebarNavSection {
    title: string;
    items: SidebarNavItem[];
}

export interface SidebarNavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
}

export const sidebarNavSections: SidebarNavSection[] = [
    {
        title: "",
        items: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Checklist Management",
        items: [
            {
                name: "Current Assignments",
                href: "/dashboard/checklists",
                icon: ListTodo,
            },
            {
                name: "Checklist Groups",
                href: "/dashboard/groups",
                icon: FolderOpen,
            },
            {
                name: "Available Templates",
                href: "/dashboard/checklists/my",
                icon: Archive,
            },
            {
                name: "Template Library",
                href: "/dashboard/templates",
                icon: FolderOpen,
            },
        ],
    },
    {
        title: "Operations",
        items: [
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
        ],
    },
    {
        title: "Team Administration",
        items: [
            {
                name: "Team Members",
                href: "/dashboard/team",
                icon: Users,
            },
            {
                name: "Team Invites",
                href: "/dashboard/team/invites",
                icon: Mail,
            },
        ],
    },
    {
        title: "System Settings",
        items: [
            {
                name: "Company Management",
                href: "/dashboard/companies",
                icon: Building2,
            },
            {
                name: "My Account",
                href: "/dashboard/profile",
                icon: UserCircle,
            },
            // {
            //     name: "Application Preferences",
            //     href: "/dashboard/settings",
            //     icon: Settings2,
            // },
        ],
    },
];