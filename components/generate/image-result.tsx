/**
 * VisionForge AI — Image Result Display
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ImageGrid, Lightbox } from "@/components/ui/image-grid";
import { Button } from "@/components/ui/button";
import { Download, Share2, Heart } from "lucide-react";
import { toast } from "@/components/ui/toast";
import type { GeneratedImage } from "@/types";

interface ImageResultProps {
    images: GeneratedImage[];
    isLoading: boolean;
    prompt?: string;
}

export function ImageResult({ images, isLoading, prompt }: ImageResultProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const handleDownload = useCallback(async (url: string) => {
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
            toast.success("Image downloaded!");
        } catch {
            toast.error("Failed to download image");
        }
    }, []);

    if (!isLoading && images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800/50 border border-surface-700/50">
                    <svg
                        className="h-8 w-8 text-surface-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                    No images yet
                </h3>
                <p className="mt-1 text-sm text-surface-400">
                    Enter a prompt and click Generate to create your first
                    image.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {prompt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg bg-surface-800/30 border border-surface-700/50 p-3"
                >
                    <p className="text-xs text-surface-400">
                        <span className="font-medium text-surface-300">
                            Prompt:
                        </span>{" "}
                        {prompt}
                    </p>
                </motion.div>
            )}

            <ImageGrid
                images={images.map((img) => ({
                    id: img.id,
                    url: img.url,
                    width: img.width,
                    height: img.height,
                }))}
                columns={images.length <= 1 ? 2 : 2}
                onImageClick={handleImageClick}
                isLoading={isLoading}
                loadingCount={4}
            />

            {/* Action buttons for each image */}
            {!isLoading && images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    {images.map((image, i) => (
                        <div
                            key={image.id}
                            className="flex items-center justify-between rounded-lg bg-surface-800/30 border border-surface-700/50 p-2"
                        >
                            <span className="text-xs text-surface-400 pl-2">
                                Image {i + 1}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDownload(image.url)}
                                >
                                    <Download className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            image.url,
                                        );
                                        toast.success("Link copied!");
                                    }}
                                >
                                    <Share2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Lightbox
                images={images.map((img) => ({ id: img.id, url: img.url }))}
                currentIndex={currentIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNext={() =>
                    setCurrentIndex((p) => Math.min(p + 1, images.length - 1))
                }
                onPrev={() => setCurrentIndex((p) => Math.max(p - 1, 0))}
                onDownload={handleDownload}
            />
        </div>
    );
}
