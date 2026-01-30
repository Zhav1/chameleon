import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { VibeSchema, VibeType } from '@/lib/chameleon/schema';
import { DEFAULT_VIBE } from '@/lib/chameleon/defaults';

/**
 * The Stylist System Prompt - Gemini Flash
 * Maps natural language descriptions to CSS variables
 */
const STYLIST_PROMPT = `You are a CSS Variable Engine called "The Stylist". Your task is to translate a user's natural language description into a VibeSchema JSON object that defines a visual theme.

## MAPPING RULES:

### Persona Detection:
- If description suggests "Child", "Kid", "ELI5", "Fun", "Playful":
  → Use 'display' font, 'hero' layout, 'high' emoji, bright/vibrant colors
  
- If description suggests "Hacker", "Cyberpunk", "Terminal", "Tech", "Matrix":
  → Use 'mono' font, 'dense' layout, 'none' emoji, green/black/neon colors
  
- If description suggests "Academic", "Professional", "Formal", "Serious":
  → Use 'serif' font, 'standard' layout, 'none' emoji, muted/paper colors
  
- If description suggests "Casual", "Friendly", "Handwritten", "Personal":
  → Use 'hand' font, 'standard' layout, 'low' emoji, warm colors
  
- If description suggests "Clean", "Modern", "Minimal":
  → Use 'sans' font, 'standard' layout, 'none' emoji, neutral colors

### Color Generation:
- Colors MUST be valid 6-digit hex codes (e.g., #FF5733)
- Ensure sufficient contrast between background and text
- 'primary' is for main UI elements
- 'accent' is for highlights and CTAs
- Make colors match the "vibe" being described

### Layout:
- 'standard': Single column, comfortable reading (768px max)
- 'dense': Multi-column, compact info display (1400px max)
- 'hero': Large, centered, impactful text (900px max)

### Voice Tone:
- 'neutral': No transformation
- 'technical': For experts
- 'simplified': For beginners/kids
- 'storytelling': Narrative, engaging

## CRITICAL CONSTRAINTS:
1. fontFamily MUST be one of: 'sans', 'serif', 'mono', 'display', 'hand'
2. baseSize MUST be one of: '14px', '16px', '18px', '24px'
3. layout.style MUST be one of: 'standard', 'dense', 'hero'
4. voice.tone MUST be one of: 'neutral', 'technical', 'simplified', 'storytelling'
5. emojiFrequency MUST be one of: 'none', 'low', 'high'
6. ALL colors MUST be valid hex codes starting with #

## OUTPUT:
Return ONLY a valid JSON object matching the VibeSchema. No markdown, no explanation.`;

export async function POST(request: NextRequest) {
    try {
        const { description } = await request.json();

        if (!description || typeof description !== 'string') {
            return NextResponse.json(
                { error: 'Description is required' },
                { status: 400 }
            );
        }

        // Check if API key is configured
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.warn('GOOGLE_GENERATIVE_AI_API_KEY not set, using default vibe');
            return NextResponse.json(DEFAULT_VIBE);
        }

        const { object } = await generateObject({
            model: google('gemini-1.5-flash'),
            schema: VibeSchema,
            system: STYLIST_PROMPT,
            prompt: `Generate a theme for: "${description}"`,
        });

        return NextResponse.json(object);
    } catch (error) {
        console.error('Vibe generation error:', error);

        // Return default vibe on any error
        return NextResponse.json(DEFAULT_VIBE);
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'POST to this endpoint with { description: "your vibe" }',
        example: { description: "Make it look like a hacker movie" }
    });
}
