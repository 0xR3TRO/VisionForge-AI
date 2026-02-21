/**
 * VisionForge AI — Analytics Service
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */

import prisma from "@/lib/prisma";
import type { AdminAnalytics } from "@/types";

/**
 * Get admin dashboard analytics.
 */
export async function getAnalytics(): Promise<AdminAnalytics> {
    const now = new Date();
    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );

    const [
        totalUsers,
        totalGenerations,
        totalImages,
        activeUsersToday,
        requestsToday,
        errorsToday,
        creditsToday,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.generationJob.count(),
        prisma.image.count(),
        prisma.generationJob
            .findMany({
                where: { createdAt: { gte: todayStart } },
                select: { userId: true },
                distinct: ["userId"],
            })
            .then((r) => r.length),
        prisma.generationJob.count({
            where: { createdAt: { gte: todayStart } },
        }),
        prisma.generationJob.count({
            where: { createdAt: { gte: todayStart }, status: "FAILED" },
        }),
        prisma.generationJob.aggregate({
            where: { createdAt: { gte: todayStart }, status: "COMPLETED" },
            _sum: { creditsUsed: true },
        }),
    ]);

    // Get daily stats for the last 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyGenerations = await prisma.generationJob.groupBy({
        by: ["createdAt"],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
    });

    // Aggregate by day
    const dailyMap = new Map<
        string,
        { generations: number; users: Set<string>; errors: number }
    >();

    const allJobs = await prisma.generationJob.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, userId: true, status: true },
    });

    for (const job of allJobs) {
        const dateKey = job.createdAt.toISOString().split("T")[0];
        if (!dailyMap.has(dateKey)) {
            dailyMap.set(dateKey, {
                generations: 0,
                users: new Set(),
                errors: 0,
            });
        }
        const entry = dailyMap.get(dateKey)!;
        entry.generations++;
        entry.users.add(job.userId);
        if (job.status === "FAILED") entry.errors++;
    }

    const dailyStats = Array.from(dailyMap.entries())
        .map(([date, data]) => ({
            date,
            generations: data.generations,
            users: data.users.size,
            errors: data.errors,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return {
        totalUsers,
        totalGenerations,
        totalImages,
        activeUsersToday,
        requestsToday,
        errorsToday,
        creditsConsumedToday: creditsToday._sum.creditsUsed ?? 0,
        dailyStats,
    };
}

/**
 * Get all users with pagination (admin).
 */
export async function getUsers(page = 1, pageSize = 20) {
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                credits: true,
                tier: true,
                createdAt: true,
                _count: { select: { generations: true, images: true } },
            },
        }),
        prisma.user.count(),
    ]);

    return {
        users,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}
