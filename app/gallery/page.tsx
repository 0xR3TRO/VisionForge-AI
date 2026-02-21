"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/image-grid";
import { Spinner } from "@/components/ui/loader";
import { toast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";
import { STYLE_PRESETS } from "@/utils/constants";
import { timeAgo } from "@/utils/format";
import {
    Images as ImagesIcon,
    Heart,
    Download,
    Filter,
    TrendingUp,
    Clock,
} from "lucide-react";
import type { GalleryImage } from "@/types";

type SortOption = "latest" | "popular" | "oldest";

export default function GalleryPage() {
    const { data: session } = useSession();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sort, setSort] = useState<SortOption>("latest");
    const [styleFilter, setStyleFilter] = useState<string>("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchImages = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                sort,
                page: page.toString(),
                pageSize: "20",
            });
            if (styleFilter) params.set("style", styleFilter);

            const res = await fetch(`/api/images?${params}`);
            if (res.ok) {
                const data = await res.json();
                setImages(data.data ?? []);
                setTotalPages(data.totalPages ?? 1);
            }
        } catch (err) {
            console.error("Failed to fetch gallery:", err);
        } finally {
            setIsLoading(false);
        }
    }, [sort, styleFilter, page]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleLike = async (imageId: string) => {
        if (!session) {
            toast.error("Sign in to like images");
            return;
        }
        try {
            const res = await fetch(`/api/images/${imageId}/like`, {
                method: "POST",
            });
            if (res.ok) {
                setImages((prev) =>
                    prev.map((img) =>
                        img.id === imageId
                            ? {
                                  ...img,
                                  isLiked: !img.isLiked,
                                  _count: {
                                      likes:
                                          img._count.likes +
                                          (img.isLiked ? -1 : 1),
                                  },
                              }
                            : img,
                    ),
                );
            }
        } catch {
            toast.error("Failed to like image");
        }
    };

    const handleDownload = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `visionforge-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch {
            toast.error("Download failed");
        }
    };

    const sortOptions: {
        value: SortOption;
        label: string;
        icon: typeof Clock;
    }[] = [
        { value: "latest", label: "Latest", icon: Clock },
        { value: "popular", label: "Popular", icon: TrendingUp },
        { value: "oldest", label: "Oldest", icon: Clock },
    ];

    return (
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ImagesIcon className="h-8 w-8 text-brand-400" />
                        Gallery
                    </h1>
                    <p className="mt-1 text-surface-400">
                        Browse stunning AI-generated images from the community.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        {sortOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    setSort(opt.value);
                                    setPage(1);
                                }}
                                className={cn(
                                    "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                                    sort === opt.value
                                        ? "border-brand-500 bg-brand-600/20 text-brand-300"
                                        : "border-surface-700 bg-surface-800/50 text-surface-400 hover:text-white",
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Style filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-surface-400" />
                        <select
                            value={styleFilter}
                            onChange={(e) => {
                                setStyleFilter(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
                        >
                            <option value="">All Styles</option>
                            {STYLE_PRESETS.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex h-[40vh] items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ImagesIcon className="mb-4 h-12 w-12 text-surface-500" />
                        <h3 className="text-lg font-medium text-white">
                            No images found
                        </h3>
                        <p className="mt-1 text-sm text-surface-400">
                            Try a different filter or check back later.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {images.map((image, i) => (
                                <motion.div
                                    key={image.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <Card
                                        variant="glass"
                                        hover
                                        className="overflow-hidden p-0"
                                    >
                                        <div
                                            className="relative aspect-square cursor-pointer overflow-hidden"
                                            onClick={() => {
                                                setCurrentIndex(i);
                                                setLightboxOpen(true);
                                            }}
                                        >
                                            <img
                                                src={image.url}
                                                alt={
                                                    image.prompt?.text ??
                                                    "AI generated"
                                                }
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                        <CardContent className="p-3">
                                            <p className="text-xs text-surface-300 line-clamp-2 mb-2">
                                                {image.prompt?.text}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {image.user?.image && (
                                                        <img
                                                            src={
                                                                image.user.image
                                                            }
                                                            alt=""
                                                            className="h-5 w-5 rounded-full"
                                                        />
                                                    )}
                                                    <span className="text-xs text-surface-500">
                                                        {image.user?.name ??
                                                            "Anonymous"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() =>
                                                            handleLike(image.id)
                                                        }
                                                        className={cn(
                                                            "rounded-md p-1 transition-colors",
                                                            image.isLiked
                                                                ? "text-red-400"
                                                                : "text-surface-500 hover:text-red-400",
                                                        )}
                                                    >
                                                        <Heart
                                                            className="h-4 w-4"
                                                            fill={
                                                                image.isLiked
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                        />
                                                    </button>
                                                    <span className="text-xs text-surface-500">
                                                        {image._count?.likes ??
                                                            0}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleDownload(
                                                                image.url,
                                                            )
                                                        }
                                                        className="ml-1 rounded-md p-1 text-surface-500 hover:text-white transition-colors"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-surface-400">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}

                <Lightbox
                    images={images.map((img) => ({
                        id: img.id,
                        url: img.url,
                        alt: img.prompt?.text,
                    }))}
                    currentIndex={currentIndex}
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    onNext={() =>
                        setCurrentIndex((p) =>
                            Math.min(p + 1, images.length - 1),
                        )
                    }
                    onPrev={() => setCurrentIndex((p) => Math.max(p - 1, 0))}
                    onDownload={handleDownload}
                />
            </motion.div>
        </div>
    );
}
