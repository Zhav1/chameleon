import { Inter, Merriweather, JetBrains_Mono, Bangers, Patrick_Hand } from 'next/font/google';

/**
 * Font configurations using next/font/google
 * These are the ONLY fonts the AI is allowed to select
 */

export const fontSans = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

export const fontSerif = Merriweather({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-serif',
    display: 'swap',
});

export const fontMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
});

export const fontDisplay = Bangers({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
});

export const fontHand = Patrick_Hand({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-hand',
    display: 'swap',
});

/**
 * Font map for dynamic lookup based on AI selection
 */
export const fontMap = {
    sans: fontSans,
    serif: fontSerif,
    mono: fontMono,
    display: fontDisplay,
    hand: fontHand,
} as const;

export type FontKey = keyof typeof fontMap;

/**
 * Get all font class names for the HTML body
 */
export const getAllFontVariables = () => {
    return `${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} ${fontDisplay.variable} ${fontHand.variable}`;
};
