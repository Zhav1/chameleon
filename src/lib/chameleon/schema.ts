import { z } from 'zod';

/**
 * VibeSchema - The contract for AI-generated styling
 * Uses strict validation to prevent hallucinations
 */
export const VibeSchema = z.object({
  themeName: z.string().describe("A creative name for this theme, e.g. 'Cyberpunk'"),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
    text: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  }),
  typography: z.object({
    fontFamily: z.enum(['sans', 'serif', 'mono', 'display', 'hand']),
    baseSize: z.enum(['14px', '16px', '18px', '24px']),
  }),
  layout: z.object({
    style: z.enum(['standard', 'dense', 'hero']),
    borderRadius: z.string(), // e.g. "0.5rem" or "0px"
  }),
  voice: z.object({
    tone: z.enum(['neutral', 'technical', 'simplified', 'storytelling']),
    emojiFrequency: z.enum(['none', 'low', 'high']),
  })
});

export type VibeType = z.infer<typeof VibeSchema>;

/**
 * Safe list of allowed fonts for AI to choose from
 * These are the ONLY fonts the AI can select
 */
export const ALLOWED_FONTS = ['sans', 'serif', 'mono', 'display', 'hand'] as const;
export type FontFamily = typeof ALLOWED_FONTS[number];

/**
 * Safe list of allowed layout modes
 */
export const ALLOWED_LAYOUTS = ['standard', 'dense', 'hero'] as const;
export type LayoutStyle = typeof ALLOWED_LAYOUTS[number];

/**
 * Safe list of allowed voice tones
 */
export const ALLOWED_TONES = ['neutral', 'technical', 'simplified', 'storytelling'] as const;
export type VoiceTone = typeof ALLOWED_TONES[number];
