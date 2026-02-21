/**
 * VisionForge AI — Theme Provider
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}
