'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChameleon } from './ChameleonRoot';

interface VoiceVibeProps {
    /** Callback when voice input is processed */
    onResult?: (transcript: string) => void;
    /** Callback to close popover after success */
    onClose?: () => void;
    /** Custom class name */
    className?: string;
}

// SpeechRecognition types
interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
}

/**
 * VoiceVibe - Voice-to-Vibe Component
 *
 * "Hey Chameleon, make it feel like a cozy coffee shop"
 * Uses Web Speech API for voice recognition
 */
export function VoiceVibe({ onResult, onClose, className = '' }: VoiceVibeProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const { setVibe, isLoading } = useChameleon();

    const getErrorMessage = (error: string): string => {
        switch (error) {
            case 'not-allowed':
                return 'Microphone access denied. Please allow microphone access.';
            case 'no-speech':
                return 'No speech detected. Please try again.';
            case 'network':
                return 'Network error. Please check your connection.';
            default:
                return 'Voice recognition failed. Please try again.';
        }
    };

    const handleTranscript = useCallback(async (text: string) => {
        if (!text.trim()) return;

        try {
            await setVibe(text.trim());
            onResult?.(text.trim());
            onClose?.();
        } catch (err) {
            console.error('Failed to set vibe from voice:', err);
            setError('Failed to apply vibe. Please try again.');
        }
    }, [setVibe, onResult, onClose]);

    // Check for browser support
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setIsSupported(false);
            return;
        }

        const recognition = new SpeechRecognitionAPI() as SpeechRecognitionInstance;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const current = event.resultIndex;
            const result = event.results[current];
            const transcriptText = result[0].transcript;

            setTranscript(transcriptText);

            // If this is a final result, process it
            if (result.isFinal) {
                handleTranscript(transcriptText);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setError(getErrorMessage(event.error));
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [handleTranscript, getErrorMessage]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            setError(null);
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Browser not supported
    if (!isSupported) {
        return (
            <div className={`voice-vibe ${className}`}>
                <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(128, 128, 128, 0.1)',
                    textAlign: 'center',
                }}>
                    <span style={{ fontSize: '24px', opacity: 0.5 }}>🎤</span>
                    <p style={{
                        margin: '8px 0 0',
                        fontSize: '12px',
                        opacity: 0.6,
                    }}>
                        Voice input not supported in this browser
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`voice-vibe ${className}`}>
            <button
                onClick={toggleListening}
                disabled={isLoading}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${isListening ? '#ef4444' : 'rgba(128, 128, 128, 0.2)'}`,
                    borderRadius: '8px',
                    background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    cursor: isLoading ? 'wait' : 'pointer',
                    transition: 'all 150ms ease',
                    opacity: isLoading ? 0.5 : 1,
                }}
            >
                <span
                    style={{
                        fontSize: '20px',
                        animation: isListening ? 'voicePulse 1s infinite' : 'none',
                    }}
                >
                    {isListening ? '🔴' : '🎤'}
                </span>
                <span style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--chameleon-text, #1a1a2e)',
                }}>
                    {isListening ? 'Listening...' : 'Speak your vibe'}
                </span>
            </button>

            {/* Live transcript */}
            {transcript && (
                <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(128, 128, 128, 0.05)',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    animation: 'fadeIn 200ms ease-out',
                }}>
                    &ldquo;{transcript}&rdquo;
                </div>
            )}

            {/* Error message */}
            {error && (
                <p style={{
                    margin: '8px 0 0',
                    fontSize: '12px',
                    color: '#ef4444',
                    textAlign: 'center',
                }}>
                    {error}
                </p>
            )}

            {/* Suggestions */}
            <div style={{
                marginTop: '10px',
                fontSize: '11px',
                opacity: 0.5,
                textAlign: 'center',
            }}>
                Try: &ldquo;Make it cozy&rdquo; or &ldquo;I&apos;m a 5 year old&rdquo;
            </div>

            <style jsx global>{`
                @keyframes voicePulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}


