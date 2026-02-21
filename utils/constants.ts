/**
 * VisionForge AI — Application Constants
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
import type { StylePreset, Resolution } from "@/types";

export const APP_NAME = "VisionForge AI";
export const APP_DESCRIPTION =
    "Generate realistic, creative, and high-quality images from text prompts using cutting-edge AI.";
export const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const DEFAULT_CREDITS = 50;
export const CREDITS_PER_GENERATION = 1;
export const MAX_IMAGES_PER_GENERATION = 4;
export const MAX_PROMPT_LENGTH = 2000;

export const STYLE_PRESETS: { value: StylePreset; label: string }[] = [
    { value: "photorealistic", label: "Photorealistic" },
    { value: "digital-art", label: "Digital Art" },
    { value: "anime", label: "Anime" },
    { value: "oil-painting", label: "Oil Painting" },
    { value: "watercolor", label: "Watercolor" },
    { value: "3d-render", label: "3D Render" },
    { value: "pixel-art", label: "Pixel Art" },
    { value: "comic-book", label: "Comic Book" },
    { value: "cinematic", label: "Cinematic" },
    { value: "fantasy", label: "Fantasy" },
    { value: "abstract", label: "Abstract" },
    { value: "minimalist", label: "Minimalist" },
];

export const RESOLUTIONS: {
    value: Resolution;
    label: string;
    w: number;
    h: number;
}[] = [
    { value: "512x512", label: "512 × 512", w: 512, h: 512 },
    { value: "768x768", label: "768 × 768", w: 768, h: 768 },
    { value: "1024x1024", label: "1024 × 1024", w: 1024, h: 1024 },
    { value: "1024x1792", label: "1024 × 1792 (Portrait)", w: 1024, h: 1792 },
    { value: "1792x1024", label: "1792 × 1024 (Landscape)", w: 1792, h: 1024 },
];

export const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/generate", label: "Generate" },
    { href: "/gallery", label: "Gallery" },
    { href: "/dashboard", label: "Dashboard" },
] as const;
