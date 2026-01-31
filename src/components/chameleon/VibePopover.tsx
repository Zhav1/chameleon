'use client';

import { useRef, useEffect, RefObject } from 'react';
import { useChameleon } from './ChameleonRoot';
import { ReadingModeSelector } from './ReadingModeSelector';
import { CustomVibeInput } from './CustomVibeInput';
import { ThinkingBubble } from './ThinkingBubble';

interface VibePopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: RefObject<HTMLElement | null>;
}

/**
 * VibePopover - The popup menu when user clicks the Chameleon icon
 * 
 * Contains:
 * - Reading mode buttons (Simple / Expert / Visual)
 * - Custom text input ("Explain like I'm a...")
 * - Visible AI thinking animation
 * - Screenshot upload zone (future)
 * - Voice input button (future)
 */
export function VibePopover({ isOpen, onClose, anchorRef }: VibePopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const { vibe, isLoading } = useChameleon();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className="vibe-popover"
            role="dialog"
            aria-label="Choose your reading mode"
            style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '340px',
                background: 'var(--chameleon-bg, #ffffff)',
                border: '1px solid rgba(128, 128, 128, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                padding: '16px',
                zIndex: 1000,
                animation: 'popoverSlideIn 200ms ease-out',
            }}
        >
            {/* Show thinking bubble when loading */}
            {isLoading ? (
                <ThinkingBubble
                    isThinking={true}
                    vibeType="both"
                    stepDelay={500}
                />
            ) : (
                <>
                    {/* Header */}
                    <div style={{
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: 600,
                            color: 'var(--chameleon-text, #1a1a2e)'
                        }}>
                            ✨ How do you want to read this?
                        </h3>
                        {vibe.themeName !== 'Academic' && (
                            <p style={{
                                margin: '4px 0 0',
                                fontSize: '12px',
                                opacity: 0.6
                            }}>
                                Current: {vibe.themeName}
                            </p>
                        )}
                    </div>

                    {/* Reading Mode Buttons */}
                    <ReadingModeSelector onSelect={onClose} />

                    {/* Divider */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '16px 0',
                        gap: '12px'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(128, 128, 128, 0.2)' }} />
                        <span style={{ fontSize: '12px', opacity: 0.5 }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(128, 128, 128, 0.2)' }} />
                    </div>

                    {/* Custom Input */}
                    <CustomVibeInput onSubmit={onClose} />
                </>
            )}

            {/* CSS Animation */}
            <style jsx global>{`
                @keyframes popoverSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

