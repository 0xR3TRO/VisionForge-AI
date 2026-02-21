/**
 * VisionForge AI — Image Generation API
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSchema } from "@/lib/validators";
import { generateImages } from "@/lib/services/image-generation";
import { hasCredits } from "@/lib/services/user-service";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 },
        );
    }

    // Rate limit per user
    const limited = rateLimitResponse(`generate:${session.user.id}`);
    if (limited) return limited;

    try {
        const body = await req.json();
        const parsed = generateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.errors[0].message },
                { status: 400 },
            );
        }

        // Check credits
        const hasSufficientCredits = await hasCredits(
            session.user.id,
            parsed.data.numImages,
        );
        if (!hasSufficientCredits) {
            return NextResponse.json(
                { success: false, error: "Insufficient credits" },
                { status: 402 },
            );
        }

        // Generate
        const result = await generateImages(parsed.data, session.user.id);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Generation error:", error);
        const message =
            error instanceof Error ? error.message : "Image generation failed";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
