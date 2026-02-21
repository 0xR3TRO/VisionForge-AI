/**
 * VisionForge AI — Homepage
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/utils/constants";
import {
    Sparkles,
    Zap,
    Palette,
    Shield,
    Download,
    Wand2,
    Images,
    Users,
    ArrowRight,
} from "lucide-react";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Generate high-quality images in seconds with our optimized AI pipeline.",
    },
    {
        icon: Palette,
        title: "12+ Style Presets",
        description:
            "From photorealistic to anime, oil painting to pixel art — choose your aesthetic.",
    },
    {
        icon: Wand2,
        title: "Prompt Enhancer",
        description:
            "AI-powered prompt rewriting for maximum quality and artistic detail.",
    },
    {
        icon: Images,
        title: "Batch Generation",
        description:
            "Generate up to 4 images at once with different variations and seeds.",
    },
    {
        icon: Download,
        title: "Instant Download",
        description:
            "Download your creations instantly in high resolution. No watermarks.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description:
            "Enterprise-grade security. Your prompts and images are protected.",
    },
];

const stats = [
    { value: "1M+", label: "Images Generated" },
    { value: "50K+", label: "Active Users" },
    { value: "12", label: "Style Presets" },
    { value: "99.9%", label: "Uptime" },
];

export default function HomePage() {
    return (
        <div className="relative">
            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-brand-600/10 blur-[120px]" />
                <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/5 blur-[140px]" />
            </div>

            {/* Hero Section */}
            <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center text-center"
                >
                    {/* Badge */}
                    <motion.div
                        variants={item}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300"
                    >
                        <Sparkles className="h-4 w-4" />
                        Powered by next-gen AI models
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        variants={item}
                        className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
                    >
                        Transform words into{" "}
                        <span className="gradient-text">stunning visuals</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={item}
                        className="mt-6 max-w-2xl text-lg text-surface-400 leading-relaxed"
                    >
                        {APP_NAME} uses cutting-edge AI to generate breathtaking
                        images from your text descriptions. Create
                        photorealistic photos, digital art, anime, and more — in
                        seconds.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        variants={item}
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link href="/generate">
                            <Button size="lg">
                                Start Generating
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/gallery">
                            <Button variant="outline" size="lg">
                                View Gallery
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Demo Preview */}
                    <motion.div
                        variants={item}
                        className="mt-16 w-full max-w-5xl"
                    >
                        <div className="relative rounded-2xl border border-surface-800/50 bg-surface-900/40 p-2 backdrop-blur-sm shadow-2xl">
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                {[
                                    "A cosmic nebula with vibrant colors",
                                    "A futuristic cyberpunk cityscape",
                                    "A serene Japanese garden at sunset",
                                    "A mystical forest with glowing mushrooms",
                                ].map((prompt, i) => (
                                    <div
                                        key={i}
                                        className="group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-surface-800 to-surface-900 border border-surface-700/50"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <p className="text-xs text-surface-500 text-center leading-relaxed">
                                                &ldquo;{prompt}&rdquo;
                                            </p>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats */}
            <section className="relative border-y border-surface-800/50 bg-surface-900/20">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-3xl font-bold gradient-text">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-sm text-surface-400">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section
                id="features"
                className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Everything you need to create
                    </h2>
                    <p className="mt-4 text-lg text-surface-400">
                        A complete toolkit for AI-powered image generation.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card variant="glass" hover className="h-full">
                                    <CardContent>
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10 border border-brand-600/20">
                                            <Icon className="h-6 w-6 text-brand-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-surface-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl border border-surface-800/50 bg-gradient-to-br from-brand-600/10 via-surface-900 to-purple-600/10 px-8 py-16 text-center sm:px-16"
                >
                    <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-brand-600/20 blur-[100px]" />
                    <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-purple-600/20 blur-[100px]" />

                    <div className="relative">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                            Ready to create something amazing?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-surface-400">
                            Start generating stunning AI images today. No credit
                            card required. 50 free credits to get you started.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link href="/generate">
                                <Button size="lg">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Start for Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
