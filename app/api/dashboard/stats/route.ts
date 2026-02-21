/**
 * VisionForge AI — Dashboard Stats API
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardStats } from "@/lib/services/user-service";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 },
        );
    }

    try {
        const stats = await getDashboardStats(session.user.id);
        return NextResponse.json({ success: true, data: stats });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stats" },
            { status: 500 },
        );
    }
}
