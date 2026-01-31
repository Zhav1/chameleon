import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { VibeSchema } from '@/lib/chameleon/schema';

/**
 * POST /api/chameleon/analyze-image
 * 
 * Analyzes a screenshot using Gemini's vision capabilities
 * and extracts a vibe (theme) that matches the design.
 */

const ImageAnalysisSchema = z.object({
    description: z.string().describe('A brief description of the design style'),
    vibe: VibeSchema,
});

const VISION_PROMPT = `You are an expert UI/UX designer and design system analyst.

Analyze this screenshot and extract its design language. You must output:

1. A brief description of the visual style
2. A complete vibe object that matches the design

Focus on extracting:
- COLORS: Primary, background, text, and accent colors (exact hex values)
- TYPOGRAPHY: Is it sans-serif, serif, monospace, display, or handwritten?
- LAYOUT: Is it standard, dense (lots of info), or hero (big and bold)?
- VOICE/TONE: Does it feel technical, simplified, storytelling, or neutral?
- BORDER RADIUS: Sharp (0px), subtle (0.5rem), or rounded (1rem)?

For fonts, you MUST pick from: "sans", "serif", "mono", "display", "hand"
For layout, you MUST pick from: "standard", "dense", "hero"
For voice tone, you MUST pick from: "neutral", "technical", "simplified", "storytelling"
For emoji frequency, you MUST pick from: "none", "low", "high"
For base size, you MUST pick from: "14px", "16px", "18px", "24px"

Be precise with colors - extract actual hex values from the design.
`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { image, mimeType } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        // Use Gemini with vision capabilities
        const { object } = await generateObject({
            model: google('gemini-2.5-flash-preview-05-20'),
            schema: ImageAnalysisSchema,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: VISION_PROMPT,
                        },
                        {
                            type: 'image',
                            // Vercel AI SDK accepts base64 data URL or URL string
                            image: `data:${mimeType || 'image/png'};base64,${image}`,
                        },
                    ],
                },
            ],
        });

        return NextResponse.json({
            success: true,
            description: object.description,
            vibe: object.vibe,
        });
    } catch (error) {
        console.error('Image analysis error:', error);

        // Return a fallback vibe if analysis fails
        return NextResponse.json({
            success: false,
            error: 'Failed to analyze image',
            description: 'Modern clean interface',
            vibe: {
                themeName: 'Extracted Theme',
                colors: {
                    primary: '#1a1a2e',
                    background: '#fafafa',
                    text: '#1a1a2e',
                    accent: '#4a90d9',
                },
                typography: {
                    fontFamily: 'sans',
                    baseSize: '16px',
                },
                layout: {
                    style: 'standard',
                    borderRadius: '0.5rem',
                },
                voice: {
                    tone: 'neutral',
                    emojiFrequency: 'none',
                },
            },
        });
    }
}
