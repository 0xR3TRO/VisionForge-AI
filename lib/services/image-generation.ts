/**
 * VisionForge AI — Image Generation Service
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 *
 * Supports OpenAI (DALL-E), Stability AI, and HuggingFace.
 * Abstracted behind a unified interface for easy provider switching.
 */

import type { GenerationParams, GeneratedImage } from "@/types";
import { parseResolution } from "@/utils/format";
import { uploadImage } from "@/lib/storage";
import prisma from "@/lib/prisma";

const AI_PROVIDER = process.env.AI_PROVIDER ?? "openai";

// ─── Main Interface ──────────────────────────────────

export async function generateImages(
    params: GenerationParams,
    userId: string,
): Promise<{ jobId: string; images: GeneratedImage[] }> {
    const { width, height } = parseResolution(params.resolution);

    // Create prompt record first
    const promptRecord = await prisma.prompt.create({
        data: {
            text: params.prompt,
            userId,
        },
    });

    // Create generation job in DB
    const job = await prisma.generationJob.create({
        data: {
            prompt: params.prompt,
            params: JSON.parse(JSON.stringify(params)),
            numImages: params.numImages,
            status: "PROCESSING",
            startedAt: new Date(),
            userId,
            promptId: promptRecord.id,
        },
    });

    try {
        let imageBuffers: Buffer[];

        switch (AI_PROVIDER) {
            case "stability":
                imageBuffers = await generateWithStability(
                    params,
                    width,
                    height,
                );
                break;
            case "huggingface":
                imageBuffers = await generateWithHuggingFace(
                    params,
                    width,
                    height,
                );
                break;
            case "openai":
            default:
                imageBuffers = await generateWithOpenAI(params, width, height);
                break;
        }

        // Upload images to cloud storage and create DB records
        const images: GeneratedImage[] = [];

        for (let i = 0; i < imageBuffers.length; i++) {
            const filename = `${job.id}-${i}.png`;
            const { key, url } = await uploadImage(imageBuffers[i], filename);

            const dbImage = await prisma.image.create({
                data: {
                    url,
                    storageKey: key,
                    width,
                    height,
                    style: params.style,
                    userId,
                    promptId: job.promptId!,
                    generationId: job.id,
                },
            });

            images.push({ id: dbImage.id, url, width, height });
        }

        // Mark job as completed
        await prisma.generationJob.update({
            where: { id: job.id },
            data: { status: "COMPLETED", completedAt: new Date() },
        });

        // Deduct credits
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: params.numImages } },
        });

        return { jobId: job.id, images };
    } catch (error) {
        // Mark job as failed
        await prisma.generationJob.update({
            where: { id: job.id },
            data: {
                status: "FAILED",
                error: error instanceof Error ? error.message : "Unknown error",
                completedAt: new Date(),
            },
        });

        throw error;
    }
}

// ─── OpenAI (DALL-E) ────────────────────────────────

async function generateWithOpenAI(
    params: GenerationParams,
    width: number,
    height: number,
): Promise<Buffer[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

    const stylePrefix = getStylePrefix(params.style);
    const prompt = `${stylePrefix}${params.prompt}`;

    const buffers: Buffer[] = [];

    for (let i = 0; i < params.numImages; i++) {
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt,
                    n: 1,
                    size: `${width}x${height}`,
                    quality: params.creativityLevel > 70 ? "hd" : "standard",
                    response_format: "b64_json",
                }),
            },
        );

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(
                `OpenAI API error: ${(err as { error?: { message?: string } }).error?.message ?? response.statusText}`,
            );
        }

        const data = (await response.json()) as {
            data: Array<{ b64_json: string }>;
        };
        const b64 = data.data[0].b64_json;
        buffers.push(Buffer.from(b64, "base64"));
    }

    return buffers;
}

// ─── Stability AI ───────────────────────────────────

async function generateWithStability(
    params: GenerationParams,
    width: number,
    height: number,
): Promise<Buffer[]> {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) throw new Error("STABILITY_API_KEY is not configured");

    const stylePrefix = getStylePrefix(params.style);
    const prompt = `${stylePrefix}${params.prompt}`;

    const body: Record<string, unknown> = {
        text_prompts: [
            { text: prompt, weight: 1 },
            ...(params.negativePrompt
                ? [{ text: params.negativePrompt, weight: -1 }]
                : []),
        ],
        cfg_scale: Math.round((params.creativityLevel / 100) * 15 + 5),
        width,
        height,
        samples: params.numImages,
        steps: 30,
    };

    if (params.seed !== undefined) {
        body.seed = params.seed;
    }

    const response = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        },
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Stability AI error: ${err}`);
    }

    const data = (await response.json()) as {
        artifacts: Array<{ base64: string }>;
    };
    return data.artifacts.map((a) => Buffer.from(a.base64, "base64"));
}

// ─── HuggingFace ────────────────────────────────────

async function generateWithHuggingFace(
    params: GenerationParams,
    _width: number,
    _height: number,
): Promise<Buffer[]> {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is not configured");

    const stylePrefix = getStylePrefix(params.style);
    const prompt = `${stylePrefix}${params.prompt}`;

    const buffers: Buffer[] = [];

    for (let i = 0; i < params.numImages; i++) {
        const seed = params.seed ?? Math.floor(Math.random() * 100000) + i;
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: `${prompt} [seed:${seed}]`,
                }),
            },
        );

        if (!response.ok) {
            throw new Error(`HuggingFace API error: ${response.statusText}`);
        }

        const arrayBuf = await response.arrayBuffer();
        buffers.push(Buffer.from(arrayBuf));
    }

    return buffers;
}

// ─── Helpers ─────────────────────────────────────────

function getStylePrefix(style: string): string {
    const map: Record<string, string> = {
        photorealistic: "Photorealistic photograph, highly detailed, ",
        "digital-art": "Digital artwork, vibrant colors, ",
        anime: "Anime style illustration, ",
        "oil-painting": "Oil painting, textured brushstrokes, ",
        watercolor: "Watercolor painting, soft edges, ",
        "3d-render": "3D rendered scene, octane render, ",
        "pixel-art": "Pixel art style, retro gaming, ",
        "comic-book": "Comic book style, bold lines, ",
        cinematic: "Cinematic shot, dramatic lighting, film grain, ",
        fantasy: "Fantasy artwork, magical atmosphere, ",
        abstract: "Abstract art, non-representational, ",
        minimalist: "Minimalist design, clean lines, ",
    };
    return map[style] ?? "";
}
