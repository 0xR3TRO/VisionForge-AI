/**
 * VisionForge AI — Admin Analytics API
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnalytics } from "@/lib/services/analytics-service";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json(
            { success: false, error: "Admin access required" },
            { status: 403 },
        );
    }

    try {
        const analytics = await getAnalytics();
        return NextResponse.json({ success: true, data: analytics });
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch analytics" },
            { status: 500 },
        );
    }
}
