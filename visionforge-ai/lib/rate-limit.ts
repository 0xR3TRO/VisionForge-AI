/**
 * VisionForge AI — Rate Limiter
 *
 * Token bucket rate limiter with per-IP and per-user limits.
 * Uses an in-memory Map (suitable for single-instance deployments).
 * For distributed deployments, swap to Redis-backed limiter.
 */

import { NextResponse } from "next/server";

interface RateLimitEntry {
    tokens: number;
    lastRefill: number;
}

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? "20", 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "60000", 10);

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now - entry.lastRefill > WINDOW_MS * 5) {
            store.delete(key);
        }
    }
}, 300_000);

export function rateLimit(identifier: string): {
    success: boolean;
    remaining: number;
} {
    const now = Date.now();
    let entry = store.get(identifier);

    if (!entry) {
        entry = { tokens: MAX_REQUESTS - 1, lastRefill: now };
        store.set(identifier, entry);
        return { success: true, remaining: entry.tokens };
    }

    // Refill tokens based on elapsed time
    const elapsed = now - entry.lastRefill;
    const refill = Math.floor((elapsed / WINDOW_MS) * MAX_REQUESTS);

    if (refill > 0) {
        entry.tokens = Math.min(MAX_REQUESTS, entry.tokens + refill);
        entry.lastRefill = now;
    }

    if (entry.tokens <= 0) {
        return { success: false, remaining: 0 };
    }

    entry.tokens -= 1;
    return { success: true, remaining: entry.tokens };
}

/**
 * Rate limit middleware for API routes.
 * Returns a NextResponse with 429 status if rate limited, or null if allowed.
 */
export function rateLimitResponse(identifier: string): NextResponse | null {
    const result = rateLimit(identifier);

    if (!result.success) {
        return NextResponse.json(
            {
                success: false,
                error: "Too many requests. Please try again later.",
            },
            {
                status: 429,
                headers: {
                    "Retry-After": Math.ceil(WINDOW_MS / 1000).toString(),
                    "X-RateLimit-Remaining": "0",
                },
            },
        );
    }

    return null;
}
