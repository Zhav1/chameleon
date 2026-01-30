'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode
} from 'react';
import { useQueryState } from 'nuqs';
import { VibeType } from '@/lib/chameleon/schema';
import { DEFAULT_VIBE, PRESET_VIBES } from '@/lib/chameleon/defaults';

interface ChameleonContextType {
    vibe: VibeType;
    isLoading: boolean;
    error: string | null;
    setVibe: (description: string) => Promise<void>;
    setVibeFromPreset: (presetKey: string) => void;
    resetVibe: () => void;
}

const ChameleonContext = createContext<ChameleonContextType | null>(null);

interface ChameleonRootProps {
    children: ReactNode;
    initialVibe?: VibeType;
}

export function ChameleonRoot({ children, initialVibe = DEFAULT_VIBE }: ChameleonRootProps) {
    const [vibeParam, setVibeParam] = useQueryState('vibe');
    const [vibe, setVibeState] = useState<VibeType>(initialVibe);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load vibe from URL param on mount
    useEffect(() => {
        if (vibeParam && PRESET_VIBES[vibeParam]) {
            setVibeState(PRESET_VIBES[vibeParam]);
        }
    }, [vibeParam]);

    // Persist vibe to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('chameleon-vibe', JSON.stringify(vibe));
        }
    }, [vibe]);

    // Load from localStorage on mount (if no URL param)
    useEffect(() => {
        if (!vibeParam && typeof window !== 'undefined') {
            const saved = localStorage.getItem('chameleon-vibe');
            if (saved) {
                try {
                    setVibeState(JSON.parse(saved));
                } catch {
                    // Invalid JSON, ignore
                }
            }
        }
    }, [vibeParam]);

    const setVibe = useCallback(async (description: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/vibe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate vibe');
            }

            const newVibe: VibeType = await response.json();
            setVibeState(newVibe);

            // Update URL param with slugified theme name
            const slug = newVibe.themeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setVibeParam(slug);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error('Vibe generation failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, [setVibeParam]);

    const setVibeFromPreset = useCallback((presetKey: string) => {
        const preset = PRESET_VIBES[presetKey];
        if (preset) {
            setVibeState(preset);
            setVibeParam(presetKey);
        }
    }, [setVibeParam]);

    const resetVibe = useCallback(() => {
        setVibeState(DEFAULT_VIBE);
        setVibeParam(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('chameleon-vibe');
        }
    }, [setVibeParam]);

    return (
        <ChameleonContext.Provider value={{
            vibe,
            isLoading,
            error,
            setVibe,
            setVibeFromPreset,
            resetVibe
        }}>
            {children}
        </ChameleonContext.Provider>
    );
}

export function useChameleon(): ChameleonContextType {
    const context = useContext(ChameleonContext);
    if (!context) {
        throw new Error('useChameleon must be used within a ChameleonRoot');
    }
    return context;
}
