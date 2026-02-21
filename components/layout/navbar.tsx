/**
 * VisionForge AI — Navigation Bar
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { APP_NAME, NAV_LINKS } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown";
import {
    Sparkles,
    Menu,
    X,
    User,
    Settings,
    LogOut,
    Shield,
    CreditCard,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-glow transition-shadow group-hover:shadow-glow-lg">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white hidden sm:block">
                        {APP_NAME}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "text-white"
                                        : "text-surface-400 hover:text-white hover:bg-surface-800/50",
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className="absolute inset-0 rounded-lg bg-surface-800/80 border border-surface-700/50"
                                        transition={{
                                            type: "spring",
                                            bounce: 0.2,
                                            duration: 0.6,
                                        }}
                                    />
                                )}
                                <span className="relative z-10">
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {session?.user ? (
                        <>
                            {/* Credits badge */}
                            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-surface-800/80 px-3 py-1.5 text-xs font-medium text-surface-300 border border-surface-700/50">
                                <CreditCard className="h-3 w-3 text-brand-400" />
                                {session.user.credits} credits
                            </div>

                            {/* User dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-700 bg-surface-800 transition-colors hover:border-brand-500/50 overflow-hidden">
                                        {session.user.image ? (
                                            <img
                                                src={session.user.image}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-4 w-4 text-surface-300" />
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-white">
                                                {session.user.name}
                                            </span>
                                            <span className="text-xs text-surface-500">
                                                {session.user.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            <User className="mr-2 h-4 w-4" />{" "}
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">
                                            <Settings className="mr-2 h-4 w-4" />{" "}
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    {session.user.role === "ADMIN" && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin">
                                                <Shield className="mr-2 h-4 w-4" />{" "}
                                                Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        <LogOut className="mr-2 h-4 w-4" /> Sign
                                        Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => signIn()}
                            >
                                Sign In
                            </Button>
                            <Button size="sm" onClick={() => signIn()}>
                                Get Started
                            </Button>
                        </div>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden rounded-lg p-2 text-surface-300 hover:bg-surface-800"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-surface-800/50 md:hidden"
                >
                    <div className="space-y-1 px-4 py-3">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-surface-800 text-white"
                                        : "text-surface-400 hover:bg-surface-800/50 hover:text-white",
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
