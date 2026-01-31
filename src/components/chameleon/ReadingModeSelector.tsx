'use client';

import { useChameleon } from './ChameleonRoot';

interface ReadingMode {
    id: string;
    label: string;
    icon: string;
    description: string;
    vibeDescription: string; // What to send to AI
}

const READING_MODES: ReadingMode[] = [
    {
        id: 'simple',
        label: 'Simple',
        icon: '👶',
        description: 'Easy to understand',
        vibeDescription: 'Make this extremely simple and easy to understand, like explaining to a curious 8-year-old. Use short sentences, fun analogies, and emojis.',
    },
    {
        id: 'expert',
        label: 'Expert',
        icon: '🎓',
        description: 'Full technical details',
        vibeDescription: 'Make this technical and expert-level. Use precise terminology, include implementation details, and assume the reader is a senior developer.',
    },
    {
        id: 'visual',
        label: 'Visual',
        icon: '🎨',
        description: 'More diagrams & visuals',
        vibeDescription: 'Make this visual and scannable. Use bullet points, highlight key concepts, suggest diagrams, and use a modern vibrant aesthetic.',
    },
];

interface ReadingModeSelectorProps {
    onSelect?: () => void;
}

/**
 * ReadingModeSelector - The preset reading mode buttons
 * 
 * [👶 Simple] [🎓 Expert] [🎨 Visual]
 */
export function ReadingModeSelector({ onSelect }: ReadingModeSelectorProps) {
    const { vibe, setVibe, isLoading } = useChameleon();

    const handleSelect = async (mode: ReadingMode) => {
        await setVibe(mode.vibeDescription);
        onSelect?.();
    };

    // Determine which mode is currently active based on vibe tone
    const getActiveMode = () => {
        if (vibe.voice.tone === 'simplified') return 'simple';
        if (vibe.voice.tone === 'technical') return 'expert';
        if (vibe.layout.style === 'hero') return 'visual';
        return null;
    };

    const activeMode = getActiveMode();

    return (
        <div
            className="reading-mode-selector"
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
            }}
        >
            {READING_MODES.map((mode) => {
                const isActive = activeMode === mode.id;

                return (
                    <button
                        key={mode.id}
                        onClick={() => handleSelect(mode)}
                        disabled={isLoading}
                        className="reading-mode-btn"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '12px 8px',
                            border: isActive
                                ? `2px solid ${vibe.colors.primary}`
                                : '2px solid rgba(128, 128, 128, 0.2)',
                            borderRadius: '8px',
                            background: isActive
                                ? `${vibe.colors.primary}15`
                                : 'transparent',
                            cursor: isLoading ? 'wait' : 'pointer',
                            transition: 'all 150ms ease',
                            opacity: isLoading ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive && !isLoading) {
                                e.currentTarget.style.background = 'rgba(128, 128, 128, 0.05)';
                                e.currentTarget.style.borderColor = vibe.colors.primary;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.2)';
                            }
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>{mode.icon}</span>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--chameleon-text, #1a1a2e)'
                        }}>
                            {mode.label}
                        </span>
                        <span style={{
                            fontSize: '11px',
                            opacity: 0.6,
                            textAlign: 'center'
                        }}>
                            {mode.description}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
