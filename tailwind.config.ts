/**
 * VisionForge AI — Tailwind CSS Configuration
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#f0f0ff",
                    100: "#e0e0ff",
                    200: "#c7c4ff",
                    300: "#a29dff",
                    400: "#7b6fff",
                    500: "#675afe",
                    600: "#5540f0",
                    700: "#4731d4",
                    800: "#3a29ab",
                    900: "#312686",
                    950: "#1d1660",
                },
                surface: {
                    50: "#f8f8fc",
                    100: "#f0f0f6",
                    200: "#e4e4ee",
                    300: "#d1d1e0",
                    400: "#a9a9c0",
                    500: "#8585a0",
                    600: "#6a6a85",
                    700: "#55556c",
                    800: "#3a3a4f",
                    900: "#24243a",
                    950: "#16162a",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                mono: ["var(--font-jetbrains)", "monospace"],
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
            },
            boxShadow: {
                glow: "0 0 20px rgba(103, 90, 254, 0.3)",
                "glow-lg": "0 0 40px rgba(103, 90, 254, 0.4)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                shimmer: "shimmer 2s linear infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};

export default config;
