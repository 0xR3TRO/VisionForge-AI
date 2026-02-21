"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
    STYLE_PRESETS,
    RESOLUTIONS,
    MAX_IMAGES_PER_GENERATION,
} from "@/utils/constants";
import { cn } from "@/utils/cn";
import { Wand2, Sparkles } from "lucide-react";
import type { GenerationParams, StylePreset, Resolution } from "@/types";

interface PromptFormProps {
    onGenerate: (params: GenerationParams) => Promise<void>;
    isGenerating: boolean;
    credits: number;
}

export function PromptForm({
    onGenerate,
    isGenerating,
    credits,
}: PromptFormProps) {
    const [prompt, setPrompt] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");
    const [style, setStyle] = useState<StylePreset>("photorealistic");
    const [resolution, setResolution] = useState<Resolution>("1024x1024");
    const [numImages, setNumImages] = useState(1);
    const [creativityLevel, setCreativityLevel] = useState(70);
    const [seed, setSeed] = useState<number | undefined>(undefined);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt");
            return;
        }
        if (credits < numImages) {
            toast.error("Not enough credits");
            return;
        }

        await onGenerate({
            prompt: prompt.trim(),
            negativePrompt: negativePrompt.trim() || undefined,
            style,
            resolution,
            numImages,
            creativityLevel,
            seed,
        });
    };

    const handleEnhance = async () => {
        if (!prompt.trim()) {
            toast.error("Enter a prompt to enhance");
            return;
        }

        setIsEnhancing(true);
        try {
            const res = await fetch("/api/prompt-enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt.trim(), style }),
            });

            if (!res.ok) throw new Error("Enhancement failed");

            const data = await res.json();
            if (data.data?.enhanced) {
                setPrompt(data.data.enhanced);
                toast.success("Prompt enhanced!");
            }
        } catch {
            toast.error("Failed to enhance prompt");
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Prompt Input */}
            <div className="relative">
                <Textarea
                    placeholder="Describe the image you want to create... e.g., 'A majestic dragon soaring above a crystal mountain at sunset'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] pr-12 text-base"
                />
                <button
                    onClick={handleEnhance}
                    disabled={isEnhancing || !prompt.trim()}
                    className="absolute right-3 top-3 rounded-lg bg-brand-600/20 p-2 text-brand-400 transition-colors hover:bg-brand-600/30 disabled:opacity-50"
                    title="Enhance prompt with AI"
                >
                    <Wand2
                        className={cn("h-4 w-4", isEnhancing && "animate-spin")}
                    />
                </button>
            </div>

            {/* Style Presets */}
            <div>
                <label className="mb-2 block text-sm font-medium text-surface-200">
                    Style Preset
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {STYLE_PRESETS.map((preset) => (
                        <button
                            key={preset.value}
                            onClick={() => setStyle(preset.value)}
                            className={cn(
                                "rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200",
                                style === preset.value
                                    ? "border-brand-500 bg-brand-600/20 text-brand-300"
                                    : "border-surface-700 bg-surface-800/50 text-surface-400 hover:border-surface-600 hover:text-white",
                            )}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resolution */}
            <div>
                <label className="mb-2 block text-sm font-medium text-surface-200">
                    Resolution
                </label>
                <div className="flex flex-wrap gap-2">
                    {RESOLUTIONS.map((res) => (
                        <button
                            key={res.value}
                            onClick={() => setResolution(res.value)}
                            className={cn(
                                "rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200",
                                resolution === res.value
                                    ? "border-brand-500 bg-brand-600/20 text-brand-300"
                                    : "border-surface-700 bg-surface-800/50 text-surface-400 hover:border-surface-600 hover:text-white",
                            )}
                        >
                            {res.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Number of Images */}
            <div>
                <label className="mb-2 block text-sm font-medium text-surface-200">
                    Number of Images
                </label>
                <div className="flex gap-2">
                    {Array.from(
                        { length: MAX_IMAGES_PER_GENERATION },
                        (_, i) => i + 1,
                    ).map((n) => (
                        <button
                            key={n}
                            onClick={() => setNumImages(n)}
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200",
                                numImages === n
                                    ? "border-brand-500 bg-brand-600/20 text-brand-300"
                                    : "border-surface-700 bg-surface-800/50 text-surface-400 hover:border-surface-600 hover:text-white",
                            )}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            {/* Creativity Slider */}
            <div>
                <label className="mb-2 flex items-center justify-between text-sm font-medium text-surface-200">
                    <span>Creativity Level</span>
                    <span className="text-xs text-brand-400">
                        {creativityLevel}%
                    </span>
                </label>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={creativityLevel}
                    onChange={(e) =>
                        setCreativityLevel(parseInt(e.target.value))
                    }
                    className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs text-surface-500">
                    <span>Precise</span>
                    <span>Creative</span>
                </div>
            </div>

            {/* Advanced */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-surface-400 hover:text-white transition-colors"
            >
                {showAdvanced ? "Hide" : "Show"} advanced options
            </button>

            {showAdvanced && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                >
                    <Textarea
                        label="Negative Prompt"
                        placeholder="What to avoid... e.g., 'blurry, low quality, distorted'"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        className="min-h-[60px]"
                    />
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-surface-200">
                            Seed (optional)
                        </label>
                        <input
                            type="number"
                            placeholder="Random"
                            value={seed ?? ""}
                            onChange={(e) =>
                                setSeed(
                                    e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                )
                            }
                            className="flex h-10 w-full max-w-[200px] rounded-lg border border-surface-700 bg-surface-900/50 px-3 py-2 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                </motion.div>
            )}

            {/* Generate Button */}
            <Button
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                isLoading={isGenerating}
                disabled={!prompt.trim() || credits < numImages}
            >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate {numImages} Image{numImages > 1 ? "s" : ""} (
                {numImages} credit
                {numImages > 1 ? "s" : ""})
            </Button>
        </div>
    );
}
