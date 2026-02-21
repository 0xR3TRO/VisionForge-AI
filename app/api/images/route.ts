import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { galleryFiltersSchema } from "@/lib/validators";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const url = new URL(req.url);

    const parsed = galleryFiltersSchema.safeParse({
        style: url.searchParams.get("style") ?? undefined,
        resolution: url.searchParams.get("resolution") ?? undefined,
        sort: url.searchParams.get("sort") ?? "latest",
        page: url.searchParams.get("page") ?? "1",
        pageSize: url.searchParams.get("pageSize") ?? "20",
    });

    if (!parsed.success) {
        return NextResponse.json(
            { success: false, error: "Invalid filters" },
            { status: 400 },
        );
    }

    const { style, sort, page, pageSize } = parsed.data;

    try {
        const where: Record<string, unknown> = { isPublic: true };
        if (style) where.style = style;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let orderBy: any;
        if (sort === "popular") {
            orderBy = { likes: { _count: "desc" } };
        } else if (sort === "oldest") {
            orderBy = { createdAt: "asc" };
        } else {
            orderBy = { createdAt: "desc" };
        }

        const [images, total] = await Promise.all([
            prisma.image.findMany({
                where,
                include: {
                    prompt: { select: { text: true } },
                    user: { select: { id: true, name: true, image: true } },
                    likes: session?.user?.id
                        ? {
                              where: { userId: session.user.id },
                              select: { id: true },
                          }
                        : false,
                    _count: { select: { likes: true } },
                },
                orderBy,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.image.count({ where }),
        ]);

        const data = images.map((img) => ({
            ...img,
            isLiked: session?.user?.id
                ? (img as unknown as { likes: unknown[] }).likes?.length > 0
                : false,
            likes: undefined,
        }));

        return NextResponse.json({
            success: true,
            data,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        console.error("Gallery fetch error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch images" },
            { status: 500 },
        );
    }
}
