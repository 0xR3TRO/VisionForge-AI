"use client";

import { cn } from "@/utils/cn";

// ─── Skeleton Loader ─────────────────────────────────

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-shimmer rounded-lg bg-gradient-to-r from-surface-800 via-surface-700 to-surface-800 bg-[length:200%_100%]",
                className,
            )}
        />
    );
}

// ─── Spinner ─────────────────────────────────────────

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    return (
        <div
            className={cn(
                "animate-spin rounded-full border-brand-500 border-t-transparent",
                sizeClasses[size],
                className,
            )}
        />
    );
}

// ─── Dots Loader ─────────────────────────────────────

export function DotsLoader({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-1", className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                />
            ))}
        </div>
    );
}

// ─── Image Skeleton ──────────────────────────────────

export function ImageSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl bg-surface-900 border border-surface-800",
                className,
            )}
        >
            <Skeleton className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
                <svg
                    className="h-10 w-10 text-surface-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                    />
                </svg>
            </div>
        </div>
    );
}

// ─── Full Page Loader ────────────────────────────────

export function PageLoader() {
    return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-sm text-surface-400 animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}
