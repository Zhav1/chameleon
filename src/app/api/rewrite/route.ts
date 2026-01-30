import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

/**
 * The Editor System Prompt - Gemini Pro
 * Rewrites content to match the target tone while preserving facts
 */
const EDITOR_PROMPT = `You are "The Editor", an adaptive content rewriter. Your task is to rewrite text to match a target tone while preserving all factual information.

## TONE DEFINITIONS:

### "technical"
- Use precise terminology and jargon
- Include technical details
- Structure with bullet points where appropriate
- Assume expert knowledge
- Be concise and information-dense

### "simplified"  
- Use simple words (5th grade reading level)
- Explain concepts with everyday analogies
- Break complex ideas into small steps
- Use short sentences
- Add clarifying examples

### "storytelling"
- Use narrative flow and engaging language
- Create vivid imagery with descriptions
- Build connections between ideas
- Add personality and warmth
- Make it memorable

## EMOJI RULES:
- "none": Do not use any emojis
- "low": Use 1-2 relevant emojis at key points
- "high": Use emojis liberally throughout (3-5 per paragraph)

## CRITICAL CONSTRAINTS:
1. TRUTH: Never change, add, or remove facts. Only change how they're expressed.
2. LENGTH: Keep approximately the same length unless simplification requires expansion.
3. FORMAT: Output clean text only. Use markdown sparingly (bold for emphasis, lists if helpful).
4. CONSISTENCY: Maintain the same writing style throughout.

## OUTPUT:
Rewrite the content following the specified tone. Output only the rewritten text, nothing else.`;

export async function POST(request: NextRequest) {
    try {
        const { text, tone, emojiFrequency, sourceUrl } = await request.json();

        if (!text || typeof text !== 'string') {
            return new Response('Text is required', { status: 400 });
        }

        // If tone is neutral, return original
        if (tone === 'neutral') {
            return new Response(text);
        }

        // Check API key
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.warn('GOOGLE_GENERATIVE_AI_API_KEY not set');
            return new Response(text);
        }

        const prompt = `
Target tone: ${tone}
Emoji frequency: ${emojiFrequency || 'none'}
${sourceUrl ? `Source URL for reference: ${sourceUrl}` : ''}

Original text to rewrite:
"""
${text}
"""

Rewrite the above text following the specified tone and emoji rules.`;

        const result = streamText({
            model: google('gemini-1.5-pro'),
            system: EDITOR_PROMPT,
            prompt,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Content rewrite error:', error);

        // Return original on error
        const { text } = await request.json().catch(() => ({ text: '' }));
        return new Response(text || 'Error processing request');
    }
}

export async function GET() {
    return new Response(JSON.stringify({
        message: 'POST to this endpoint with { text, tone, emojiFrequency }',
        example: {
            text: "The mitochondria is the powerhouse of the cell.",
            tone: "simplified",
            emojiFrequency: "high"
        }
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
