/**
 * VisionForge AI — Footer
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
"use client";

import Link from "next/link";
import { APP_NAME } from "@/utils/constants";
import { Sparkles, Github, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-surface-800/50 bg-surface-950/80">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                {APP_NAME}
                            </span>
                        </Link>
                        <p className="text-sm text-surface-400 leading-relaxed">
                            Generate stunning AI images from text prompts. Fast,
                            creative, and production-ready.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-white">
                            Product
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { href: "/generate", label: "Generate" },
                                { href: "/gallery", label: "Gallery" },
                                { href: "/#pricing", label: "Pricing" },
                                { href: "/#features", label: "Features" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-surface-400 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-white">
                            Resources
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { href: "/docs", label: "API Docs" },
                                { href: "/blog", label: "Blog" },
                                { href: "/changelog", label: "Changelog" },
                                { href: "/support", label: "Support" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-surface-400 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-white">
                            Legal
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { href: "/privacy", label: "Privacy Policy" },
                                { href: "/terms", label: "Terms of Service" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-surface-400 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-800/50 pt-8 sm:flex-row">
                    <p className="text-xs text-surface-500">
                        &copy; {new Date().getFullYear()} {APP_NAME}. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-surface-500 transition-colors hover:text-white"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-surface-500 transition-colors hover:text-white"
                        >
                            <Twitter className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
