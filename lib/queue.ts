/**
 * VisionForge AI — Generation Queue
 *
 * Uses BullMQ with Redis for production job queuing.
 * Falls back to an in-memory queue when Redis is unavailable (dev mode).
 */

import type { GenerationParams } from "@/types";

export interface QueueJob {
    id: string;
    userId: string;
    params: GenerationParams;
    createdAt: Date;
}

type JobHandler = (job: QueueJob) => Promise<void>;

// ─── In-Memory Queue (Development Fallback) ─────────

class InMemoryQueue {
    private handler: JobHandler | null = null;
    private jobs: QueueJob[] = [];

    async add(job: QueueJob): Promise<void> {
        this.jobs.push(job);
        if (this.handler) {
            // Process immediately in dev mode
            await this.handler(job);
        }
    }

    process(handler: JobHandler): void {
        this.handler = handler;
    }

    getJobs(): QueueJob[] {
        return [...this.jobs];
    }
}

// ─── BullMQ Queue (Production) ──────────────────────

let bullQueue: unknown = null;

async function getBullMQQueue() {
    if (bullQueue) return bullQueue;

    try {
        const { Queue } = await import("bullmq");
        const { default: IORedis } = await import("ioredis");

        const connection = new IORedis(
            process.env.REDIS_URL ?? "redis://localhost:6379",
            {
                maxRetriesPerRequest: null,
            },
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bullQueue = new Queue("image-generation", {
            connection: connection as any,
        });
        return bullQueue;
    } catch {
        console.warn(
            "BullMQ/Redis not available, falling back to in-memory queue",
        );
        return null;
    }
}

// ─── Unified Queue Interface ────────────────────────

const memoryQueue = new InMemoryQueue();

export async function addToQueue(job: QueueJob): Promise<string> {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl && process.env.NODE_ENV === "production") {
        try {
            const queue = (await getBullMQQueue()) as {
                add: (
                    name: string,
                    data: QueueJob,
                    opts: Record<string, unknown>,
                ) => Promise<{ id: string }>;
            } | null;
            if (queue) {
                const bullJob = await queue.add("generate", job, {
                    attempts: 3,
                    backoff: { type: "exponential", delay: 2000 },
                    removeOnComplete: { count: 100 },
                    removeOnFail: { count: 50 },
                });
                return bullJob.id;
            }
        } catch (err) {
            console.error("Failed to add job to BullMQ, falling back:", err);
        }
    }

    // Fallback: in-memory
    await memoryQueue.add(job);
    return job.id;
}

export function processQueue(handler: JobHandler): void {
    memoryQueue.process(handler);
}

export { memoryQueue };
