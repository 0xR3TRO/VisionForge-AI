/**
 * VisionForge AI — Image Grid & Lightbox
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { ImageSkeleton } from "./loader";

// ─── Image Grid ──────────────────────────────────────

interface ImageGridProps {
    images: Array<{
        id: string;
        url: string;
        width?: number;
        height?: number;
        alt?: string;
    }>;
    columns?: 2 | 3 | 4;
    onImageClick?: (index: number) => void;
    className?: string;
    isLoading?: boolean;
    loadingCount?: number;
}

export function ImageGrid({
    images,
    columns = 2,
    onImageClick,
    className,
    isLoading,
    loadingCount = 4,
}: ImageGridProps) {
    const colClasses = {
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    return (
        <div className={cn("grid gap-4", colClasses[columns], className)}>
            <AnimatePresence mode="popLayout">
                {isLoading
                    ? Array.from({ length: loadingCount }).map((_, i) => (
                          <ImageSkeleton
                              key={`skeleton-${i}`}
                              className="aspect-square"
                          />
                      ))
                    : images.map((image, index) => (
                          <motion.div
                              key={image.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{
                                  duration: 0.3,
                                  delay: index * 0.05,
                              }}
                              className={cn(
                                  "group relative aspect-square overflow-hidden rounded-xl border border-surface-800 bg-surface-900 cursor-pointer",
                                  "hover:border-brand-500/50 hover:shadow-glow transition-all duration-300",
                              )}
                              onClick={() => onImageClick?.(index)}
                          >
                              <Image
                                  src={image.url}
                                  alt={
                                      image.alt ??
                                      `Generated image ${index + 1}`
                                  }
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </motion.div>
                      ))}
            </AnimatePresence>
        </div>
    );
}

// ─── Lightbox ────────────────────────────────────────

interface LightboxProps {
    images: Array<{ id: string; url: string; alt?: string }>;
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    onDownload?: (url: string) => void;
}

export function Lightbox({
    images,
    currentIndex,
    isOpen,
    onClose,
    onNext,
    onPrev,
    onDownload,
}: LightboxProps) {
    const image = images[currentIndex];

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowRight":
                    onNext();
                    break;
                case "ArrowLeft":
                    onPrev();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, onNext, onPrev]);

    if (!isOpen || !image) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
                onClick={onClose}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-lg bg-surface-900/80 p-2 text-white transition-colors hover:bg-surface-800"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Counter */}
                <div className="absolute top-4 left-4 z-10 rounded-lg bg-surface-900/80 px-3 py-1 text-sm text-surface-300">
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Prev */}
                {currentIndex > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrev();
                        }}
                        className="absolute left-4 z-10 rounded-full bg-surface-900/80 p-3 text-white transition-colors hover:bg-surface-800"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                )}

                {/* Next */}
                {currentIndex < images.length - 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        className="absolute right-4 z-10 rounded-full bg-surface-900/80 p-3 text-white transition-colors hover:bg-surface-800"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                )}

                {/* Image */}
                <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative max-h-[85vh] max-w-[85vw]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={image.url}
                        alt={image.alt ?? ""}
                        className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
                    />
                </motion.div>

                {/* Download */}
                {onDownload && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload(image.url);
                        }}
                        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Download
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
