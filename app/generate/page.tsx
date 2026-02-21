"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PromptForm } from "@/components/generate/prompt-form";
import { ImageResult } from "@/components/generate/image-result";
import { toast } from "@/components/ui/toast";
import type { GenerationParams, GeneratedImage } from "@/types";
import { CreditCard, Sparkles } from "lucide-react";

export default function GeneratePage() {
    const { data: session } = useSession();
    const [isGenerating, setIsGenerating] = useState(false);
    const [images, setImages] = useState<GeneratedImage[]>([]);
    const [lastPrompt, setLastPrompt] = useState<string>("");
    const credits = session?.user?.credits ?? 0;

    const handleGenerate = async (params: GenerationParams) => {
        setIsGenerating(true);
        setImages([]);
        setLastPrompt(params.prompt);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error ?? "Generation failed");
            }

            setImages(data.data.images);
            toast.success(`Generated ${data.data.images.length} image(s)!`);
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to generate images",
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-brand-600/5 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Sparkles className="h-8 w-8 text-brand-400" />
                            Generate
                        </h1>
                        <p className="mt-1 text-surface-400">
                            Describe your vision and watch it come to life.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-surface-800/80 px-4 py-2 border border-surface-700/50">
                        <CreditCard className="h-4 w-4 text-brand-400" />
                        <span className="text-sm font-medium text-white">
                            {credits}
                        </span>
                        <span className="text-xs text-surface-400">
                            credits
                        </span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left: Form */}
                    <Card variant="glass">
                        <CardContent>
                            <PromptForm
                                onGenerate={handleGenerate}
                                isGenerating={isGenerating}
                                credits={credits}
                            />
                        </CardContent>
                    </Card>

                    {/* Right: Results */}
                    <Card variant="glass">
                        <CardContent>
                            <h2 className="mb-4 text-lg font-semibold text-white">
                                Results
                            </h2>
                            <ImageResult
                                images={images}
                                isLoading={isGenerating}
                                prompt={lastPrompt}
                            />
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
