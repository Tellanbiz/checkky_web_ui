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
                name: "Area Sections",
                href: "/dashboard/sections",
                icon: MapPin,
            },
            {
                name: "Checklists",
                href: "/dashboard/checklists",
                icon: CheckSquare,
                badge: "12",
            },
        ],
    },
    {
        title: "Team & Communication",
        items: [
            {
                name: "Team",
                href: "/dashboard/team",
                icon: Users,
            },
            {
                name: "Team Chat",
                href: "/dashboard/chat",
                icon: MessageSquare,
                badge: "3",
            },
        ],
    },
    {
        title: "Business",
        items: [
            {
                name: "Analytics",
                href: "/dashboard/analytics",
                icon: BarChart3,
            },
            {
                name: "Companies",
                href: "/dashboard/companies",
                icon: Building2,
            },
            {
                name: "Guidelines",
                href: "/dashboard/guidelines",
                icon: FileText,
            },
        ],
    },
    {
        title: "System",
        items: [
            {
                name: "Admin Tools",
                href: "/dashboard/admin",
                icon: Shield,
            },
            {
                name: "Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],
    },
];