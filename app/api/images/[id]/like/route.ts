import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 },
        );
    }

    const { id: imageId } = await params;

    try {
        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_imageId: {
                    userId: session.user.id,
                    imageId,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({ where: { id: existingLike.id } });
            return NextResponse.json({
                success: true,
                data: { liked: false },
            });
        }

        // Like
        await prisma.like.create({
            data: {
                userId: session.user.id,
                imageId,
            },
        });

        return NextResponse.json({
            success: true,
            data: { liked: true },
        });
    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to toggle like" },
            { status: 500 },
        );
    }
}
