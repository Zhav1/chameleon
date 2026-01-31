'use client';

import { useState, useRef, useEffect } from 'react';
import { useChameleon } from './ChameleonRoot';
import { VibePopover } from './VibePopover';

interface ChameleonWidgetProps {
    /** Position hint for styling */
    position?: 'navbar' | 'floating' | 'inline';
    /** Custom class name */
    className?: string;
}

/**
 * ChameleonWidget - The main entry point for the Chameleon SDK
 * 
 * A small 🦎 icon that sits in the navbar (like a dark mode toggle).
 * Click to open the Vibe Popover with reading mode options.
 */
export function ChameleonWidget({
    position = 'navbar',
    className = ''
}: ChameleonWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { vibe, isLoading } = useChameleon();

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const positionClasses = {
        navbar: 'relative',
        floating: 'fixed bottom-4 right-4 z-50',
        inline: 'inline-block',
    };

    return (
        <div className={`chameleon-widget ${positionClasses[position]} ${className}`}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="chameleon-trigger"
                aria-label="Open Chameleon vibe selector"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid rgba(128, 128, 128, 0.2)',
                    background: isOpen ? 'rgba(128, 128, 128, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    fontSize: '20px',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(128, 128, 128, 0.1)';
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.background = 'transparent';
                    }
                }}
            >
                <span className={isLoading ? 'animate-pulse' : ''}>
                    🦎
                </span>
            </button>

            {/* Current vibe indicator */}
            {vibe.themeName !== 'Academic' && (
                <span
                    className="chameleon-badge"
                    style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: vibe.colors.primary,
                        border: '2px solid var(--chameleon-bg, white)',
                    }}
                    title={`Current vibe: ${vibe.themeName}`}
                />
            )}

            {/* Popover */}
            <VibePopover
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                anchorRef={buttonRef}
            />
        </div>
    );
}
