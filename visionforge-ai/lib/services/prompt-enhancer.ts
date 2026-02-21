/**
 * VisionForge AI — Prompt Enhancer Service
 *
 * Uses AI to improve, expand, and generate variations of user prompts.
 */

import type { EnhancedPrompt } from "@/types";

/**
 * Enhance a user prompt using OpenAI GPT.
 */
export async function enhancePrompt(
    prompt: string,
    style?: string,
): Promise<EnhancedPrompt> {
    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, use rule-based enhancement
    if (!apiKey) {
        return ruleBasedEnhance(prompt, style);
    }

    try {
        const systemPrompt = `You are an expert AI image prompt engineer. Given a user's image generation prompt, you must:
1. Enhance it for maximum quality and detail
2. Add artistic and technical details
3. Generate 3 creative variations
4. Extract relevant style tags

Respond in JSON format:
{
  "enhanced": "the improved prompt",
  "variations": ["variation1", "variation2", "variation3"],
  "tags": ["tag1", "tag2", "tag3"]
}`;

        const userMsg = style
            ? `Enhance this prompt for "${style}" style: "${prompt}"`
            : `Enhance this image generation prompt: "${prompt}"`;

        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userMsg },
                    ],
                    temperature: 0.8,
                    max_tokens: 1000,
                    response_format: { type: "json_object" },
                }),
            },
        );

        if (!response.ok) {
            console.error(
                "OpenAI prompt enhance failed, falling back to rule-based",
            );
            return ruleBasedEnhance(prompt, style);
        }

        const data = (await response.json()) as {
            choices: Array<{ message: { content: string } }>;
        };

        const result = JSON.parse(data.choices[0].message.content) as {
            enhanced: string;
            variations: string[];
            tags: string[];
        };

        return {
            original: prompt,
            enhanced: result.enhanced,
            variations: result.variations,
            tags: result.tags,
        };
    } catch (error) {
        console.error("Prompt enhancement error:", error);
        return ruleBasedEnhance(prompt, style);
    }
}

// ─── Rule-Based Fallback ────────────────────────────

function ruleBasedEnhance(prompt: string, style?: string): EnhancedPrompt {
    const qualityTerms = [
        "highly detailed",
        "professional quality",
        "sharp focus",
        "elegant composition",
        "masterful lighting",
    ];

    const styleTerms: Record<string, string[]> = {
        photorealistic: [
            "8K UHD",
            "DSLR quality",
            "natural lighting",
            "depth of field",
        ],
        "digital-art": [
            "vibrant colors",
            "detailed illustration",
            "trending on ArtStation",
        ],
        anime: ["beautiful anime art", "detailed eyes", "studio quality"],
        "oil-painting": [
            "impasto technique",
            "rich textures",
            "gallery quality",
        ],
        watercolor: ["soft washes", "delicate details", "flowing pigments"],
        "3d-render": [
            "octane render",
            "ray tracing",
            "volumetric lighting",
            "8K",
        ],
        "pixel-art": ["16-bit style", "retro palette", "clean pixels"],
        cinematic: [
            "anamorphic lens",
            "film grain",
            "dramatic shadows",
            "35mm",
        ],
        fantasy: ["magical atmosphere", "ethereal glow", "mythical"],
        abstract: ["bold composition", "dynamic forms", "color theory"],
        minimalist: ["clean design", "negative space", "geometric"],
    };

    const selected = qualityTerms.slice(0, 3);
    if (style && styleTerms[style]) {
        selected.push(...styleTerms[style].slice(0, 2));
    }

    const enhanced = `${prompt}, ${selected.join(", ")}`;

    const variations = [
        `${prompt}, cinematic lighting, ultra-detailed, 8K resolution`,
        `${prompt}, dreamy atmosphere, soft colors, artistic composition`,
        `${prompt}, bold contrast, dramatic perspective, award-winning`,
    ];

    const tags = [
        style ?? "general",
        "ai-generated",
        ...prompt
            .split(" ")
            .slice(0, 3)
            .map((w) => w.toLowerCase()),
    ];

    return { original: prompt, enhanced, variations, tags };
}
