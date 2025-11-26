import { LayoutDashboard, CheckSquare, MapPin, Users, BarChart3, Building2, Settings, User, Workflow, FileText } from "lucide-react";

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
        title: "Operations",
        items: [
            {
                name: "Workflow Automation",
                href: "/dashboard/workflows",
                icon: Workflow,
            },   
            {
                name: "Checklist Management",
                href: "/dashboard/checklists",
                icon: CheckSquare,
            },
            {
                name: "Template Library",
                href: "/dashboard/templates",
                icon: FileText,
            },
            {
                name: "Area Management",
                href: "/dashboard/sections",
                icon: MapPin,
            },
        ],
    },
    {
        title: "Team Management",
        items: [
            {
                name: "Team Members",
                href: "/dashboard/team",
                icon: Users,
            },
        ],
    },
    {
        title: "Account Settings",
        items: [
            {
                name: "Company Management",
                href: "/dashboard/companies",
                icon: Building2,
            },
            {
                name: "Account Information",
                href: "/dashboard/profile",
                icon: User,
            },
        ],
    },
];