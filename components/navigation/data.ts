import { 
    LayoutDashboard, 
    CheckSquare, 
    MapPin, 
    Users, 
    BarChart3, 
    Building2, 
    Settings, 
    User, 
    Workflow, 
    FileText,
    ListTodo,
    Archive,
    FolderOpen,
    Map,
    UserCircle,
    Settings2,
    Mail
} from "lucide-react";

export interface NavigationSection {
    title: string;
    items: NavigationItem[];
}

export interface NavigationItem {
    name: string;
    href: string;
    icon: any;
    badge?: string;
}

export const navigation: NavigationSection[] = [
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