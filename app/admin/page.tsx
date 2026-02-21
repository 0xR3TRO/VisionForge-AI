"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/loader";
import { formatNumber } from "@/utils/format";
import {
    Users,
    Images,
    Zap,
    AlertTriangle,
    Activity,
    CreditCard,
    BarChart3,
} from "lucide-react";
import type { AdminAnalytics } from "@/types";

export default function AdminPage() {
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch("/api/admin/analytics");
                if (res.ok) {
                    const data = await res.json();
                    setAnalytics(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const overviewStats = [
        {
            title: "Total Users",
            value: formatNumber(analytics?.totalUsers ?? 0),
            icon: Users,
            color: "text-brand-400",
            bg: "bg-brand-600/10",
        },
        {
            title: "Total Generations",
            value: formatNumber(analytics?.totalGenerations ?? 0),
            icon: Zap,
            color: "text-emerald-400",
            bg: "bg-emerald-600/10",
        },
        {
            title: "Total Images",
            value: formatNumber(analytics?.totalImages ?? 0),
            icon: Images,
            color: "text-purple-400",
            bg: "bg-purple-600/10",
        },
        {
            title: "Active Today",
            value: formatNumber(analytics?.activeUsersToday ?? 0),
            icon: Activity,
            color: "text-blue-400",
            bg: "bg-blue-600/10",
        },
        {
            title: "Requests Today",
            value: formatNumber(analytics?.requestsToday ?? 0),
            icon: BarChart3,
            color: "text-orange-400",
            bg: "bg-orange-600/10",
        },
        {
            title: "Errors Today",
            value: formatNumber(analytics?.errorsToday ?? 0),
            icon: AlertTriangle,
            color: "text-red-400",
            bg: "bg-red-600/10",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BarChart3 className="h-7 w-7 text-brand-400" />
                    Admin Analytics
                </h1>
                <p className="mt-1 text-surface-400">
                    System overview and usage statistics.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {overviewStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card variant="glass">
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${stat.color}`}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-surface-400">
                                                {stat.title}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Daily Activity Chart (simplified) */}
            <Card variant="glass">
                <CardContent>
                    <CardTitle className="mb-6">
                        Daily Activity (Last 30 Days)
                    </CardTitle>
                    {analytics?.dailyStats &&
                    analytics.dailyStats.length > 0 ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-4 text-xs text-surface-400 mb-2">
                                <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                                    Generations
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    Users
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                    Errors
                                </span>
                            </div>
                            <div className="grid gap-1">
                                {analytics.dailyStats.slice(-14).map((stat) => {
                                    const maxGen = Math.max(
                                        ...analytics.dailyStats.map(
                                            (s) => s.generations,
                                        ),
                                        1,
                                    );
                                    const pct =
                                        (stat.generations / maxGen) * 100;
                                    return (
                                        <div
                                            key={stat.date}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="w-20 text-xs text-surface-500 shrink-0">
                                                {stat.date.slice(5)}
                                            </span>
                                            <div className="flex-1 h-5 rounded-full bg-surface-800/50 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${pct}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                    }}
                                                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                                                />
                                            </div>
                                            <span className="w-12 text-xs text-surface-400 text-right">
                                                {stat.generations}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-surface-400 py-8 text-center">
                            No activity data yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
