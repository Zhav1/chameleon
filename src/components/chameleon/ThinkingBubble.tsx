'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface ThinkingStep {
    id: string;
    message: string;
    status: 'thinking' | 'complete' | 'error';
    icon?: string;
}

interface ThinkingBubbleProps {
    /** Whether the thinking animation is active */
    isThinking: boolean;
    /** Thinking steps to display */
    steps?: ThinkingStep[];
    /** Auto-generate thinking steps based on vibe type */
    vibeType?: 'style' | 'content' | 'both';
    /** Custom thinking messages */
    messages?: string[];
    /** Duration before showing each step (ms) */
    stepDelay?: number;
    /** Children to render after thinking completes */
    children?: ReactNode;
    /** Custom class name */
    className?: string;
}

// Pre-defined thinking messages for different vibe types
const THINKING_MESSAGES = {
    style: [
        { message: 'Analyzing visual requirements...', icon: '🎨' },
        { message: 'Selecting color palette...', icon: '🌈' },
        { message: 'Choosing typography...', icon: '✍️' },
        { message: 'Optimizing layout...', icon: '📐' },
        { message: 'Applying theme...', icon: '✨' },
    ],
    content: [
        { message: 'Understanding context...', icon: '🧠' },
        { message: 'Analyzing tone requirements...', icon: '🎯' },
        { message: 'Adapting vocabulary...', icon: '📝' },
        { message: 'Restructuring content...', icon: '🔄' },
        { message: 'Finalizing text...', icon: '✅' },
    ],
    both: [
        { message: 'Analyzing your vibe...', icon: '🦎' },
        { message: 'Understanding your preferences...', icon: '🧠' },
        { message: 'Generating color palette...', icon: '🎨' },
        { message: 'Selecting typography...', icon: '✍️' },
        { message: 'Adapting content style...', icon: '📝' },
        { message: 'Optimizing layout...', icon: '📐' },
        { message: 'Morphing complete!', icon: '✨' },
    ],
};

/**
 * ThinkingBubble - Shows AI reasoning in real-time
 * 
 * "The Magic Moment" - Users see the AI thinking, making it feel alive
 */
export function ThinkingBubble({
    isThinking,
    steps,
    vibeType = 'both',
    messages,
    stepDelay = 600,
    children,
    className = '',
}: ThinkingBubbleProps) {
    const [visibleSteps, setVisibleSteps] = useState<ThinkingStep[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Generate steps from messages or use pre-defined
    const thinkingSteps: ThinkingStep[] = steps ||
        (messages || THINKING_MESSAGES[vibeType]).map((item, i) => ({
            id: `step-${i}`,
            message: typeof item === 'string' ? item : item.message,
            icon: typeof item === 'string' ? '🔄' : item.icon || '🔄',
            status: 'thinking' as const,
        }));

    // Animate steps appearing one by one
    useEffect(() => {
        if (!isThinking) {
            setVisibleSteps([]);
            setCurrentIndex(0);
            return;
        }

        if (currentIndex >= thinkingSteps.length) return;

        const timer = setTimeout(() => {
            setVisibleSteps(prev => {
                const newSteps = [...prev];
                // Mark previous step as complete
                if (newSteps.length > 0) {
                    newSteps[newSteps.length - 1] = {
                        ...newSteps[newSteps.length - 1],
                        status: 'complete',
                    };
                }
                // Add new step
                return [...newSteps, thinkingSteps[currentIndex]];
            });
            setCurrentIndex(prev => prev + 1);
        }, currentIndex === 0 ? 100 : stepDelay);

        return () => clearTimeout(timer);
    }, [isThinking, currentIndex, stepDelay, thinkingSteps]);

    if (!isThinking && !visibleSteps.length) {
        return <>{children}</>;
    }

    return (
        <div className={`thinking-bubble ${className}`}>
            <div
                style={{
                    background: 'rgba(128, 128, 128, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                    }}
                >
                    <span className="thinking-pulse" style={{ fontSize: '20px' }}>
                        🧠
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>
                        Chameleon is thinking...
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {visibleSteps.map((step, index) => (
                        <div
                            key={step.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                paddingLeft: '8px',
                                animation: 'thinkingStepFadeIn 300ms ease-out',
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>
                                {step.status === 'complete' ? '✅' : step.icon}
                            </span>
                            <span
                                style={{
                                    fontSize: '14px',
                                    opacity: step.status === 'complete' ? 0.7 : 1,
                                    textDecoration: step.status === 'complete' ? 'line-through' : 'none',
                                }}
                            >
                                {step.message}
                            </span>
                            {step.status === 'thinking' && index === visibleSteps.length - 1 && (
                                <span className="thinking-dots">
                                    <span className="dot">.</span>
                                    <span className="dot">.</span>
                                    <span className="dot">.</span>
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Render children with fade when thinking completes */}
            {!isThinking && children && (
                <div style={{ animation: 'thinkingContentFadeIn 500ms ease-out' }}>
                    {children}
                </div>
            )}

            <style jsx global>{`
                @keyframes thinkingStepFadeIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes thinkingContentFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .thinking-pulse {
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .thinking-dots {
                    display: inline-flex;
                    margin-left: 4px;
                }

                .thinking-dots .dot {
                    animation: dotBlink 1.4s infinite;
                    opacity: 0;
                }

                .thinking-dots .dot:nth-child(1) {
                    animation-delay: 0s;
                }

                .thinking-dots .dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .thinking-dots .dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes dotBlink {
                    0%, 20%, 100% { opacity: 0; }
                    40%, 80% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

/**
 * useThinkingState - Hook to manage thinking state with auto-clear
 */
export function useThinkingState(duration: number = 3000) {
    const [isThinking, setIsThinking] = useState(false);

    const startThinking = () => {
        setIsThinking(true);
    };

    const stopThinking = () => {
        setIsThinking(false);
    };

    // Auto-stop after duration (for demo purposes)
    useEffect(() => {
        if (isThinking) {
            const timer = setTimeout(() => setIsThinking(false), duration);
            return () => clearTimeout(timer);
        }
    }, [isThinking, duration]);

    return { isThinking, startThinking, stopThinking };
}
