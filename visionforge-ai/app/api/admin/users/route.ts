import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUsers } from "@/lib/services/analytics-service";
import { updateUserSchema } from "@/lib/validators";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json(
            { success: false, error: "Admin access required" },
            { status: 403 },
        );
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20");

    try {
        const result = await getUsers(page, pageSize);
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("Admin users error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 },
        );
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json(
            { success: false, error: "Admin access required" },
            { status: 403 },
        );
    }

    try {
        const body = await req.json();
        const { userId, ...updates } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "userId is required" },
                { status: 400 },
            );
        }

        const parsed = updateUserSchema.safeParse(updates);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.errors[0].message },
                { status: 400 },
            );
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: parsed.data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                credits: true,
                tier: true,
            },
        });

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("Admin update user error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update user" },
            { status: 500 },
        );
    }
}
