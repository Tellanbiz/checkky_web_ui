import { LayoutDashboard, CheckSquare, MapPin, Users, BarChart3, Building2, Settings, User } from "lucide-react";

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
        ],
    },
    // {
    //     title: "Business",
    //     items: [
    //         {
    //             name: "Business Analytics",
    //             href: "/dashboard/analytics",
    //             icon: BarChart3,
    //         },

    //     ],
    // },
    // {
    //     title: "System",
    //     items: [
    //         {
    //             name: "System Settings",
    //             href: "/dashboard/settings",
    //             icon: Settings,
    //         },
    //     ],
    // },
    {
        title: "Account",
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