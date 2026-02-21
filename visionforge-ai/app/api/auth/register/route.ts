import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validators";
import { createUser } from "@/lib/services/user-service";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    // Rate limit
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const limited = rateLimitResponse(`signup:${ip}`);
    if (limited) return limited;

    try {
        const body = await req.json();
        const parsed = signUpSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.errors[0].message },
                { status: 400 },
            );
        }

        const user = await createUser(parsed.data);

        return NextResponse.json(
            {
                success: true,
                data: user,
                message: "Account created successfully",
            },
            { status: 201 },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Registration failed";
        return NextResponse.json(
            { success: false, error: message },
            { status: 400 },
        );
    }
}
