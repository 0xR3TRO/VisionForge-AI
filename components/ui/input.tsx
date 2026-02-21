"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-surface-200">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex h-10 w-full rounded-lg border border-surface-700 bg-surface-900/50 px-3 py-2 text-sm text-white placeholder:text-surface-500 transition-all duration-200",
                            "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                            "hover:border-surface-600",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            icon && "pl-10",
                            error &&
                                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
        );
    },
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-surface-200">
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        "flex min-h-[100px] w-full rounded-lg border border-surface-700 bg-surface-900/50 px-3 py-2 text-sm text-white placeholder:text-surface-500 transition-all duration-200",
                        "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                        "hover:border-surface-600",
                        "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                        error &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
        );
    },
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
