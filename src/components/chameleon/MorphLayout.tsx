'use client';

import { type ReactNode } from 'react';
import { useChameleon } from './ChameleonRoot';
import { fontMap } from '@/lib/chameleon/fonts';

interface MorphLayoutProps {
    children: ReactNode;
    className?: string;
}

/**
 * MorphLayout - Injects CSS variables from the current vibe into the DOM
 * All children will inherit these variables for dynamic styling
 */
export function MorphLayout({ children, className = '' }: MorphLayoutProps) {
    const { vibe, isLoading } = useChameleon();

    // Get the font CSS variable based on vibe selection
    const fontVariable = `var(--font-${vibe.typography.fontFamily})`;

    // Get layout class based on vibe
    const layoutClass = `layout-${vibe.layout.style}`;

    return (
        <div
            className={`morph-container ${layoutClass} ${isLoading ? 'morphing' : ''} ${className}`}
            style={{
                // Color variables
                '--chameleon-bg': vibe.colors.background,
                '--chameleon-text': vibe.colors.text,
                '--chameleon-primary': vibe.colors.primary,
                '--chameleon-accent': vibe.colors.accent,

                // Typography variables
                '--chameleon-font': fontVariable,
                '--chameleon-base-size': vibe.typography.baseSize,

                // Layout variables
                '--chameleon-radius': vibe.layout.borderRadius,

                // Apply the theme immediately
                backgroundColor: vibe.colors.background,
                color: vibe.colors.text,
                fontFamily: fontVariable,
                fontSize: vibe.typography.baseSize,
                borderRadius: vibe.layout.borderRadius,
                minHeight: '100vh',
                transition: 'all 300ms ease-in-out',
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
}

/**
 * MorphCard - A card component that respects the current vibe
 */
export function MorphCard({ children, className = '' }: MorphLayoutProps) {
    const { vibe } = useChameleon();

    return (
        <div
            className={`morph-card ${className}`}
            style={{
                backgroundColor: vibe.colors.background,
                borderColor: `${vibe.colors.text}20`,
                borderRadius: vibe.layout.borderRadius,
            }}
        >
            {children}
        </div>
    );
}

/**
 * MorphButton - A button component that respects the current vibe
 */
interface MorphButtonProps {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export function MorphButton({
    children,
    onClick,
    disabled,
    variant = 'primary',
    className = ''
}: MorphButtonProps) {
    const { vibe, isLoading } = useChameleon();

    const isPrimary = variant === 'primary';

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`morph-button ${className}`}
            style={{
                backgroundColor: isPrimary ? vibe.colors.primary : 'transparent',
                color: isPrimary ? vibe.colors.background : vibe.colors.primary,
                border: isPrimary ? 'none' : `2px solid ${vibe.colors.primary}`,
                borderRadius: vibe.layout.borderRadius,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
        >
            {isLoading ? '✨ Morphing...' : children}
        </button>
    );
}
