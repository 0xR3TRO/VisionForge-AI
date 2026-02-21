"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import {
    LayoutDashboard,
    Images,
    Clock,
    CreditCard,
    Settings,
    Shield,
    Users,
    BarChart3,
    Key,
} from "lucide-react";

interface SidebarProps {
    type?: "dashboard" | "admin";
}

const dashboardLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/history", label: "History", icon: Clock },
    { href: "/dashboard/images", label: "My Images", icon: Images },
    { href: "/dashboard/credits", label: "Credits", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
    { href: "/admin", label: "Analytics", icon: BarChart3 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/generations", label: "Generations", icon: Images },
    { href: "/admin/api-keys", label: "API Keys", icon: Key },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ type = "dashboard" }: SidebarProps) {
    const pathname = usePathname();
    const links = type === "admin" ? adminLinks : dashboardLinks;

    return (
        <aside className="w-64 shrink-0 border-r border-surface-800/50 bg-surface-950/50">
            <div className="flex h-full flex-col p-4">
                <div className="mb-6 flex items-center gap-2 px-3">
                    {type === "admin" ? (
                        <Shield className="h-5 w-5 text-brand-400" />
                    ) : (
                        <LayoutDashboard className="h-5 w-5 text-brand-400" />
                    )}
                    <h2 className="text-sm font-semibold text-white">
                        {type === "admin" ? "Admin Panel" : "Dashboard"}
                    </h2>
                </div>

                <nav className="flex-1 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-brand-600/10 text-brand-400 border border-brand-600/20"
                                        : "text-surface-400 hover:bg-surface-800/50 hover:text-white",
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
