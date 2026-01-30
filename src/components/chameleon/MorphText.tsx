'use client';

import { useEffect, useState, useCallback } from 'react';
import { useChameleon } from './ChameleonRoot';

interface MorphTextProps {
    /** The original text content to display/transform */
    originalText: string;
    /** Optional source URL for grounding */
    sourceUrl?: string;
    /** Custom class name */
    className?: string;
    /** Whether to allow manual rewrite trigger */
    autoRewrite?: boolean;
}

/**
 * MorphText - Adaptive text component that rewrites content based on vibe tone
 * 
 * - If tone is 'neutral', displays originalText as-is
 * - If tone is changed, calls Gemini Pro to rewrite the content
 */
export function MorphText({
    originalText,
    sourceUrl,
    className = '',
    autoRewrite = true
}: MorphTextProps) {
    const { vibe } = useChameleon();
    const [displayText, setDisplayText] = useState(originalText);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const rewriteContent = useCallback(async () => {
        // Don't rewrite if tone is neutral
        if (vibe.voice.tone === 'neutral') {
            setDisplayText(originalText);
            return;
        }

        setIsStreaming(true);
        setError(null);

        try {
            const response = await fetch('/api/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: originalText,
                    tone: vibe.voice.tone,
                    emojiFrequency: vibe.voice.emojiFrequency,
                    sourceUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to rewrite content');
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let result = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    result += chunk;
                    setDisplayText(result);
                }
            } else {
                // Fallback for non-streaming response
                const data = await response.json();
                setDisplayText(data.text || originalText);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Rewrite failed');
            setDisplayText(originalText);
        } finally {
            setIsStreaming(false);
        }
    }, [originalText, vibe.voice.tone, vibe.voice.emojiFrequency, sourceUrl]);

    // Auto-rewrite when tone changes
    useEffect(() => {
        if (autoRewrite) {
            rewriteContent();
        }
    }, [autoRewrite, rewriteContent]);

    // Reset to original when originalText changes
    useEffect(() => {
        setDisplayText(originalText);
    }, [originalText]);

    return (
        <div className={`morph-text ${isStreaming ? 'morphing' : ''} ${className}`}>
            <div className="morph-text-content whitespace-pre-wrap">
                {displayText}
            </div>

            {isStreaming && (
                <div className="morph-text-indicator text-sm opacity-60 mt-2">
                    ✨ Adapting content...
                </div>
            )}

            {error && (
                <div className="morph-text-error text-red-500 text-sm mt-2">
                    ⚠️ {error}
                </div>
            )}

            {!autoRewrite && vibe.voice.tone !== 'neutral' && (
                <button
                    onClick={rewriteContent}
                    disabled={isStreaming}
                    className="morph-text-button mt-2 text-sm underline opacity-70 hover:opacity-100"
                >
                    🔄 Rewrite for {vibe.voice.tone} tone
                </button>
            )}
        </div>
    );
}

/**
 * MorphHeading - An adaptive heading component
 */
interface MorphHeadingProps {
    children: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
}

export function MorphHeading({
    children,
    level = 2,
    className = ''
}: MorphHeadingProps) {
    const { vibe } = useChameleon();

    // Add emoji based on frequency
    const getEmoji = () => {
        if (vibe.voice.emojiFrequency === 'none') return '';
        if (vibe.voice.emojiFrequency === 'high') return ' ✨';
        return '';
    };

    const content = <>{children}{getEmoji()}</>;
    const headingClass = `morph-heading ${className}`;

    switch (level) {
        case 1: return <h1 className={headingClass}>{content}</h1>;
        case 2: return <h2 className={headingClass}>{content}</h2>;
        case 3: return <h3 className={headingClass}>{content}</h3>;
        case 4: return <h4 className={headingClass}>{content}</h4>;
        case 5: return <h5 className={headingClass}>{content}</h5>;
        case 6: return <h6 className={headingClass}>{content}</h6>;
        default: return <h2 className={headingClass}>{content}</h2>;
    }
}

