"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { APP_NAME } from "@/utils/constants";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Registration failed");
                setIsLoading(false);
                return;
            }

            router.push("/login?registered=true");
        } catch {
            setError("Something went wrong");
            setIsLoading(false);
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
                    <h1 className="text-3xl font-bold mb-2">
                        Create your account
                    </h1>
                    <p className="text-zinc-400">
                        Start generating amazing images
                    </p>
                </div>

                <Card variant="glass" className="p-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                        />
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
                                placeholder="Min. 8 characters"
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
                            Create Account
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-zinc-400 mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-brand-400 hover:text-brand-300"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
