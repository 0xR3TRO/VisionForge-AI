import { z } from "zod";
import {
    MAX_PROMPT_LENGTH,
    MAX_IMAGES_PER_GENERATION,
} from "@/utils/constants";

// ─── Generation ──────────────────────────────────────

export const generateSchema = z.object({
    prompt: z
        .string()
        .min(3, "Prompt must be at least 3 characters")
        .max(
            MAX_PROMPT_LENGTH,
            `Prompt must be under ${MAX_PROMPT_LENGTH} characters`,
        ),
    negativePrompt: z.string().max(500).optional(),
    style: z.enum([
        "photorealistic",
        "digital-art",
        "anime",
        "oil-painting",
        "watercolor",
        "3d-render",
        "pixel-art",
        "comic-book",
        "cinematic",
        "fantasy",
        "abstract",
        "minimalist",
    ]),
    resolution: z.enum([
        "512x512",
        "768x768",
        "1024x1024",
        "1024x1792",
        "1792x1024",
    ]),
    numImages: z.number().int().min(1).max(MAX_IMAGES_PER_GENERATION),
    creativityLevel: z.number().min(0).max(100),
    seed: z.number().int().optional(),
});

export type GenerateInput = z.infer<typeof generateSchema>;

// ─── Auth ────────────────────────────────────────────

export const signUpSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(128),
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// ─── Prompt Enhance ──────────────────────────────────

export const promptEnhanceSchema = z.object({
    prompt: z.string().min(3).max(MAX_PROMPT_LENGTH),
    style: z.string().optional(),
});

// ─── Gallery Filters ─────────────────────────────────

export const galleryFiltersSchema = z.object({
    style: z.string().optional(),
    resolution: z.string().optional(),
    sort: z.enum(["latest", "popular", "oldest"]).default("latest"),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

// ─── Admin ───────────────────────────────────────────

export const updateUserSchema = z.object({
    role: z.enum(["USER", "ADMIN"]).optional(),
    credits: z.number().int().min(0).optional(),
    tier: z.enum(["FREE", "PRO", "ENTERPRISE"]).optional(),
});
