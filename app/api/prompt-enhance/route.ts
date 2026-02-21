/**
 * VisionForge AI — Prompt Enhancement API
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promptEnhanceSchema } from "@/lib/validators";
import { enhancePrompt } from "@/lib/services/prompt-enhancer";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 },
        );
    }

    const limited = rateLimitResponse(`enhance:${session.user.id}`);
    if (limited) return limited;

    try {
        const body = await req.json();
        const parsed = promptEnhanceSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.errors[0].message },
                { status: 400 },
            );
        }

        const result = await enhancePrompt(
            parsed.data.prompt,
            parsed.data.style,
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Prompt enhance error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to enhance prompt" },
            { status: 500 },
        );
    }
}
