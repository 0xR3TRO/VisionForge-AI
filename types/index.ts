/**
 * VisionForge AI — Type Definitions
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */

// ─── VisionForge AI — Type Definitions ───────────────

import type { User, Image, Prompt, GenerationJob } from "@prisma/client";

// Re-exports
export type { User, Image, Prompt, GenerationJob };

// ─── Generation ──────────────────────────────────────

export type StylePreset =
    | "photorealistic"
    | "digital-art"
    | "anime"
    | "oil-painting"
    | "watercolor"
    | "3d-render"
    | "pixel-art"
    | "comic-book"
    | "cinematic"
    | "fantasy"
    | "abstract"
    | "minimalist";

export type Resolution =
    | "512x512"
    | "768x768"
    | "1024x1024"
    | "1024x1792"
    | "1792x1024";

export interface GenerationParams {
    prompt: string;
    negativePrompt?: string;
    style: StylePreset;
    resolution: Resolution;
    numImages: number;
    creativityLevel: number; // 0-100
    seed?: number;
}

export interface GenerationResult {
    jobId: string;
    status: "queued" | "processing" | "completed" | "failed";
    images: GeneratedImage[];
    error?: string;
}

export interface GeneratedImage {
    id: string;
    url: string;
    width: number;
    height: number;
}

// ─── API ─────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ─── User ────────────────────────────────────────────

export interface UserProfile {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: "USER" | "ADMIN";
    credits: number;
    tier: "FREE" | "PRO" | "ENTERPRISE";
    createdAt: Date;
}

export interface DashboardStats {
    totalGenerations: number;
    totalImages: number;
    creditsUsed: number;
    creditsRemaining: number;
    recentGenerations: (GenerationJob & { images: Image[] })[];
}

// ─── Admin ───────────────────────────────────────────

export interface AdminAnalytics {
    totalUsers: number;
    totalGenerations: number;
    totalImages: number;
    activeUsersToday: number;
    requestsToday: number;
    errorsToday: number;
    creditsConsumedToday: number;
    dailyStats: DailyStat[];
}

export interface DailyStat {
    date: string;
    generations: number;
    users: number;
    errors: number;
}

// ─── Gallery ─────────────────────────────────────────

export interface GalleryImage extends Image {
    prompt: Prompt;
    user: Pick<User, "id" | "name" | "image">;
    _count: { likes: number };
    isLiked?: boolean;
}

export interface GalleryFilters {
    style?: StylePreset;
    resolution?: Resolution;
    sort?: "latest" | "popular" | "oldest";
    page?: number;
    pageSize?: number;
}

// ─── Prompt Enhancer ─────────────────────────────────

export interface EnhancedPrompt {
    original: string;
    enhanced: string;
    variations: string[];
    tags: string[];
}
