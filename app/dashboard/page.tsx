/**
 * VisionForge AI — Dashboard Page
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/loader";
import { formatNumber, timeAgo } from "@/utils/format";
import {
    Images,
    Zap,
    CreditCard,
    Clock,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/dashboard/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Generations",
            value: formatNumber(stats?.totalGenerations ?? 0),
            icon: Zap,
            color: "text-brand-400",
            bg: "bg-brand-600/10",
        },
        {
            title: "Total Images",
            value: formatNumber(stats?.totalImages ?? 0),
            icon: Images,
            color: "text-emerald-400",
            bg: "bg-emerald-600/10",
        },
        {
            title: "Credits Used",
            value: formatNumber(stats?.creditsUsed ?? 0),
            icon: TrendingUp,
            color: "text-orange-400",
            bg: "bg-orange-600/10",
        },
        {
            title: "Credits Remaining",
            value: formatNumber(stats?.creditsRemaining ?? 0),
            icon: CreditCard,
            color: "text-purple-400",
            bg: "bg-purple-600/10",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Welcome back, {session?.user?.name ?? "User"}
                    </h1>
                    <p className="mt-1 text-surface-400">
                        Here&apos;s your generation overview.
                    </p>
                </div>
                <Link href="/generate">
                    <Button>
                        <Zap className="mr-2 h-4 w-4" />
                        New Generation
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card variant="glass">
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${stat.color}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-2xl font-bold text-white">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-surface-400">
                                            {stat.title}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Generations */}
            <Card variant="glass">
                <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                        <CardTitle>Recent Generations</CardTitle>
                        <Link
                            href="/dashboard/history"
                            className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                        >
                            View all <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {stats?.recentGenerations &&
                    stats.recentGenerations.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentGenerations.slice(0, 5).map((gen) => (
                                <div
                                    key={gen.id}
                                    className="flex items-center justify-between rounded-lg bg-surface-800/30 border border-surface-700/50 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-700/50">
                                            <Images className="h-5 w-5 text-surface-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white line-clamp-1 max-w-[300px]">
                                                {gen.prompt}
                                            </p>
                                            <p className="text-xs text-surface-500">
                                                {gen.images.length} image(s)
                                                &middot;{" "}
                                                {timeAgo(gen.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                            gen.status === "COMPLETED"
                                                ? "bg-emerald-600/10 text-emerald-400"
                                                : gen.status === "FAILED"
                                                  ? "bg-red-600/10 text-red-400"
                                                  : "bg-yellow-600/10 text-yellow-400"
                                        }`}
                                    >
                                        {gen.status.toLowerCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-8 text-center">
                            <Clock className="mb-2 h-8 w-8 text-surface-500" />
                            <p className="text-sm text-surface-400">
                                No generations yet.
                            </p>
                            <Link href="/generate">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2"
                                >
                                    Create your first image
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
