import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/toast";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/utils/constants";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
});

export const metadata: Metadata = {
    metadataBase: new URL(APP_URL),
    title: {
        default: `${APP_NAME} — AI Image Generation Platform`,
        template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    keywords: [
        "AI image generator",
        "text to image",
        "AI art",
        "image generation",
        "VisionForge",
        "DALL-E",
        "Stable Diffusion",
    ],
    authors: [{ name: APP_NAME }],
    creator: APP_NAME,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: APP_URL,
        title: APP_NAME,
        description: APP_DESCRIPTION,
        siteName: APP_NAME,
    },
    twitter: {
        card: "summary_large_image",
        title: APP_NAME,
        description: APP_DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrains.variable} font-sans`}
            >
                <AuthProvider>
                    <ThemeProvider>
                        <div className="relative flex min-h-screen flex-col">
                            <Navbar />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </div>
                        <ToastProvider />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
