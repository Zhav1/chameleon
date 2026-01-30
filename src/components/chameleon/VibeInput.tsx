'use client';

import { useState, FormEvent } from 'react';
import { useChameleon } from './ChameleonRoot';
import { MorphButton } from './MorphLayout';
import { PRESET_VIBES } from '@/lib/chameleon/defaults';

interface VibeInputProps {
    placeholder?: string;
    className?: string;
}

/**
 * VibeInput - Natural language input for setting vibes
 */
export function VibeInput({
    placeholder = "Describe your vibe... (e.g., 'Make it look like a hacker movie')",
    className = ''
}: VibeInputProps) {
    const { setVibe, isLoading, error } = useChameleon();
    const [input, setInput] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            await setVibe(input.trim());
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`vibe-input-form ${className}`}>
            <div className="flex gap-3 items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-current/20 bg-transparent 
                     focus:outline-none focus:border-current/40 transition-colors
                     placeholder:opacity-50"
                    style={{ borderRadius: 'var(--chameleon-radius)' }}
                />
                <MorphButton disabled={!input.trim() || isLoading}>
                    {isLoading ? '✨' : '🎨 Morph'}
                </MorphButton>
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-2">⚠️ {error}</p>
            )}
        </form>
    );
}

/**
 * VibePresets - Quick-select buttons for preset vibes
 */
interface VibePresetsProps {
    className?: string;
}

export function VibePresets({ className = '' }: VibePresetsProps) {
    const { setVibeFromPreset, vibe } = useChameleon();

    const presets = Object.entries(PRESET_VIBES).map(([key, preset]) => ({
        key,
        name: preset.themeName,
        emoji: getPresetEmoji(key),
    }));

    return (
        <div className={`vibe-presets flex flex-wrap gap-2 ${className}`}>
            {presets.map(({ key, name, emoji }) => (
                <button
                    key={key}
                    onClick={() => setVibeFromPreset(key)}
                    className={`px-4 py-2 rounded-full border-2 transition-all hover:scale-105
                      ${vibe.themeName === name
                            ? 'border-current bg-current/10 font-semibold'
                            : 'border-current/30 hover:border-current/60'
                        }`}
                >
                    {emoji} {name}
                </button>
            ))}
        </div>
    );
}

function getPresetEmoji(key: string): string {
    switch (key) {
        case 'academic': return '📚';
        case 'cyberpunk': return '🤖';
        case 'kid': return '🎈';
        case 'cozy': return '🏡';
        default: return '✨';
    }
}
