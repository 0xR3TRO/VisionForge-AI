/**
 * VisionForge AI — User Service
 */

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { UserProfile, DashboardStats } from "@/types";

/**
 * Register a new user with email/password.
 */
export async function createUser(data: {
    name: string;
    email: string;
    password: string;
}): Promise<UserProfile> {
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existing) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            credits: parseInt(process.env.DEFAULT_USER_CREDITS ?? "50", 10),
        },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        credits: user.credits,
        tier: user.tier,
        createdAt: user.createdAt,
    };
}

/**
 * Get user profile by ID.
 */
export async function getUserProfile(
    userId: string,
): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            credits: true,
            tier: true,
            createdAt: true,
        },
    });

    return user;
}

/**
 * Get user dashboard statistics.
 */
export async function getDashboardStats(
    userId: string,
): Promise<DashboardStats> {
    const [
        totalGenerations,
        totalImages,
        creditsUsed,
        user,
        recentGenerations,
    ] = await Promise.all([
        prisma.generationJob.count({ where: { userId } }),
        prisma.image.count({ where: { userId } }),
        prisma.generationJob.aggregate({
            where: { userId, status: "COMPLETED" },
            _sum: { creditsUsed: true },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        }),
        prisma.generationJob.findMany({
            where: { userId },
            include: { images: true },
            orderBy: { createdAt: "desc" },
            take: 10,
        }),
    ]);

    return {
        totalGenerations,
        totalImages,
        creditsUsed: creditsUsed._sum.creditsUsed ?? 0,
        creditsRemaining: user?.credits ?? 0,
        recentGenerations,
    };
}

/**
 * Check if user has enough credits.
 */
export async function hasCredits(
    userId: string,
    amount: number,
): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
    });
    return (user?.credits ?? 0) >= amount;
}
