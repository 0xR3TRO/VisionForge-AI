import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**.amazonaws.com" },
            { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
            {
                protocol: "https",
                hostname: "oaidalleapiprodscus.blob.core.windows.net",
            },
            { protocol: "https", hostname: "avatars.githubusercontent.com" },
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    headers: async () => [
        {
            source: "/(.*)",
            headers: [
                { key: "X-Frame-Options", value: "DENY" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                    key: "Referrer-Policy",
                    value: "strict-origin-when-cross-origin",
                },
                {
                    key: "Content-Security-Policy",
                    value: "default-src 'self'; img-src 'self' blob: data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https:;",
                },
            ],
        },
    ],
};

export default nextConfig;
