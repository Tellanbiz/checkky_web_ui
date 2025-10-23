import { LayoutDashboard, CheckSquare, MapPin, Users, MessageSquare, BarChart3, Building2, FileText, Shield, Settings } from "lucide-react";

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
        title: "Main",
        items: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                name: "Area Management",
                href: "/dashboard/sections",
                icon: MapPin,
            },
            {
                name: "Checklist Management",
                href: "/dashboard/checklists",
                icon: CheckSquare,
            },
        ],
    },
    {
        title: "Team & Communication",
        items: [
            {
                name: "Team Members",
                href: "/dashboard/team",
                icon: Users,
            },
            {
                name: "Team Chat",
                href: "/dashboard/chat",
                icon: MessageSquare,
            },
        ],
    },
    {
        title: "Business",
        items: [
            {
                name: "Business Analytics",
                href: "/dashboard/analytics",
                icon: BarChart3,
            },
            {
                name: "Company Partners",
                href: "/dashboard/companies",
                icon: Building2,
            },
            {
                name: "Business Guidelines",
                href: "/dashboard/guidelines",
                icon: FileText,
            },
        ],
    },
    {
        title: "System",
        items: [
            {
                name: "System Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],
    },
];