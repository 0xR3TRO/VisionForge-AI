/**
 * VisionForge AI — Cloud Storage Service
 *
 * Supports AWS S3, Cloudflare R2, and Supabase Storage.
 * Abstracted behind a unified interface.
 */

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER ?? "s3";

interface UploadResult {
    key: string;
    url: string;
}

/**
 * Upload a buffer (image) to cloud storage.
 */
export async function uploadImage(
    buffer: Buffer,
    filename: string,
    contentType = "image/png",
): Promise<UploadResult> {
    const key = `generations/${Date.now()}-${filename}`;

    switch (STORAGE_PROVIDER) {
        case "r2":
            return uploadToR2(buffer, key, contentType);
        case "supabase":
            return uploadToSupabase(buffer, key, contentType);
        case "s3":
        default:
            return uploadToS3(buffer, key, contentType);
    }
}

/**
 * Delete an image from cloud storage.
 */
export async function deleteImage(key: string): Promise<void> {
    switch (STORAGE_PROVIDER) {
        case "r2":
            return deleteFromR2(key);
        case "supabase":
            return deleteFromSupabase(key);
        case "s3":
        default:
            return deleteFromS3(key);
    }
}

// ─── S3 Implementation ───────────────────────────────

async function uploadToS3(
    buffer: Buffer,
    key: string,
    contentType: string,
): Promise<UploadResult> {
    // Dynamic import to avoid bundling AWS SDK on the client
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    const client = new S3Client({
        region: process.env.AWS_REGION ?? "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    const bucket = process.env.AWS_S3_BUCKET!;

    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: "public, max-age=31536000, immutable",
        }),
    );

    return {
        key,
        url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
}

async function deleteFromS3(key: string): Promise<void> {
    const { S3Client, DeleteObjectCommand } =
        await import("@aws-sdk/client-s3");

    const client = new S3Client({
        region: process.env.AWS_REGION ?? "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    await client.send(
        new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
        }),
    );
}

// ─── R2 Implementation ──────────────────────────────

async function uploadToR2(
    buffer: Buffer,
    key: string,
    contentType: string,
): Promise<UploadResult> {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    const client = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
    });

    await client.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }),
    );

    return {
        key,
        url: `${process.env.R2_PUBLIC_URL}/${key}`,
    };
}

async function deleteFromR2(key: string): Promise<void> {
    const { S3Client, DeleteObjectCommand } =
        await import("@aws-sdk/client-s3");

    const client = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
    });

    await client.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
        }),
    );
}

// ─── Supabase Implementation ────────────────────────

async function uploadToSupabase(
    buffer: Buffer,
    key: string,
    contentType: string,
): Promise<UploadResult> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const bucket = "visionforge-images";

    const response = await fetch(
        `${supabaseUrl}/storage/v1/object/${bucket}/${key}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": contentType,
                "x-upsert": "true",
            },
            body: new Uint8Array(buffer),
        },
    );

    if (!response.ok) {
        throw new Error(`Supabase upload failed: ${response.statusText}`);
    }

    return {
        key,
        url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${key}`,
    };
}

async function deleteFromSupabase(key: string): Promise<void> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const bucket = "visionforge-images";

    await fetch(`${supabaseUrl}/storage/v1/object/${bucket}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prefixes: [key] }),
    });
}
