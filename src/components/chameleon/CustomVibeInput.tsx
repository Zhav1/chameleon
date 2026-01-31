'use client';

import { useState, FormEvent } from 'react';
import { useChameleon } from './ChameleonRoot';

interface CustomVibeInputProps {
    onSubmit?: () => void;
}

const EXAMPLE_PLACEHOLDERS = [
    'Explain like I\'m a gamer...',
    'Make it feel like a cozy cabin...',
    'I\'m a 5 year old who loves dinosaurs...',
    'Think cyberpunk hacker vibes...',
    'Make it professional for my boss...',
];

/**
 * CustomVibeInput - Free text input for custom vibes
 * 
 * "Explain like I'm a gamer..." → AI generates matching theme + content
 */
export function CustomVibeInput({ onSubmit }: CustomVibeInputProps) {
    const [value, setValue] = useState('');
    const [placeholder] = useState(() =>
        EXAMPLE_PLACEHOLDERS[Math.floor(Math.random() * EXAMPLE_PLACEHOLDERS.length)]
    );
    const { setVibe, isLoading, vibe } = useChameleon();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!value.trim() || isLoading) return;

        await setVibe(value.trim());
        setValue('');
        onSubmit?.();
    };

    return (
        <form onSubmit={handleSubmit} className="custom-vibe-input">
            <div style={{
                display: 'flex',
                gap: '8px',
            }}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        fontSize: '14px',
                        border: '2px solid rgba(128, 128, 128, 0.2)',
                        borderRadius: '8px',
                        background: 'transparent',
                        color: 'var(--chameleon-text, #1a1a2e)',
                        outline: 'none',
                        transition: 'border-color 150ms ease',
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = vibe.colors.primary;
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.2)';
                    }}
                />
                <button
                    type="submit"
                    disabled={!value.trim() || isLoading}
                    style={{
                        padding: '10px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '8px',
                        background: vibe.colors.primary,
                        color: vibe.colors.background,
                        cursor: (!value.trim() || isLoading) ? 'not-allowed' : 'pointer',
                        opacity: (!value.trim() || isLoading) ? 0.5 : 1,
                        transition: 'all 150ms ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <span>Apply</span>
                    <span>✨</span>
                </button>
            </div>

            {/* Quick suggestions */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginTop: '10px',
            }}>
                {['🎮 Gamer', '👶 Kid', '💼 Pro', '🌙 Cozy'].map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => setValue(suggestion.slice(2))}
                        disabled={isLoading}
                        style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            border: '1px solid rgba(128, 128, 128, 0.2)',
                            borderRadius: '16px',
                            background: 'transparent',
                            cursor: 'pointer',
                            opacity: isLoading ? 0.5 : 1,
                            transition: 'all 100ms ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(128, 128, 128, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </form>
    );
}
