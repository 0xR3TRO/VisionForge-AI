/**
 * VisionForge AI — Login Page
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Mail, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { APP_NAME } from "@/utils/constants";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
            setIsLoading(false);
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <Sparkles className="w-8 h-8 text-brand-400" />
                        <span className="text-2xl font-bold">{APP_NAME}</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                    <p className="text-zinc-400">
                        Sign in to continue creating
                    </p>
                </div>

                <Card variant="glass" className="p-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3 mb-6">
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => signIn("github", { callbackUrl })}
                        >
                            <Github className="w-4 h-4 mr-2" />
                            Continue with GitHub
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => signIn("google", { callbackUrl })}
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Continue with Google
                        </Button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-surface-800 px-2 text-zinc-500">
                                or
                            </span>
                        </div>
                    </div>

                    <form
                        onSubmit={handleCredentialsLogin}
                        className="space-y-4"
                    >
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-zinc-400 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-zinc-400 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-brand-400 hover:text-brand-300"
                    >
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
