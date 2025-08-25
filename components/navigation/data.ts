import { LayoutDashboard, CheckSquare, MapPin, Users, MessageSquare, BarChart3, Building2, FileText, Shield, Settings } from "lucide-react";

export const navigation = [
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
];