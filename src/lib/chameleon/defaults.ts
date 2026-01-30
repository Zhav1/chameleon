import { VibeType } from './schema';

/**
 * Default vibe - fallback when AI generation fails or for initial state
 * Uses clean, professional styling (Academic persona)
 */
export const DEFAULT_VIBE: VibeType = {
    themeName: 'Academic',
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
    }
};

/**
 * Preset vibes for quick selection
 */
export const PRESET_VIBES: Record<string, VibeType> = {
    academic: DEFAULT_VIBE,

    cyberpunk: {
        themeName: 'Cyberpunk',
        colors: {
            primary: '#00ff41',
            background: '#0d0208',
            text: '#00ff41',
            accent: '#ff0080',
        },
        typography: {
            fontFamily: 'mono',
            baseSize: '14px',
        },
        layout: {
            style: 'dense',
            borderRadius: '0px',
        },
        voice: {
            tone: 'technical',
            emojiFrequency: 'none',
        }
    },

    kid: {
        themeName: 'Fun Zone',
        colors: {
            primary: '#ff6b6b',
            background: '#fff9db',
            text: '#2d3436',
            accent: '#00b894',
        },
        typography: {
            fontFamily: 'display',
            baseSize: '24px',
        },
        layout: {
            style: 'hero',
            borderRadius: '1.5rem',
        },
        voice: {
            tone: 'simplified',
            emojiFrequency: 'high',
        }
    },

    cozy: {
        themeName: 'Cozy Cabin',
        colors: {
            primary: '#8b4513',
            background: '#fdf5e6',
            text: '#3e2723',
            accent: '#d4a574',
        },
        typography: {
            fontFamily: 'hand',
            baseSize: '18px',
        },
        layout: {
            style: 'standard',
            borderRadius: '1rem',
        },
        voice: {
            tone: 'storytelling',
            emojiFrequency: 'low',
        }
    },
};
