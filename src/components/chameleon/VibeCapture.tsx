'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent, ClipboardEvent } from 'react';
import { useChameleon } from './ChameleonRoot';
import { ThinkingBubble } from './ThinkingBubble';

interface VibeCaptureProps {
    /** Callback when image is processed */
    onCapture?: (imageData: string) => void;
    /** Callback to close popover after success */
    onClose?: () => void;
    /** Custom class name */
    className?: string;
}

// Thinking messages for screenshot analysis
const SCREENSHOT_THINKING = [
    { message: 'Analyzing screenshot...', icon: '📸' },
    { message: 'Detecting color palette...', icon: '🎨' },
    { message: 'Identifying typography style...', icon: '✍️' },
    { message: 'Extracting layout patterns...', icon: '📐' },
    { message: 'Detecting visual effects...', icon: '✨' },
    { message: 'Generating matching vibe...', icon: '🦎' },
];

/**
 * VibeCapture - Screenshot-to-Vibe Component
 * 
 * Drop or paste a screenshot → AI extracts the design language
 * Uses Gemini's Agentic Vision capabilities
 */
export function VibeCapture({ onCapture, onClose, className = '' }: VibeCaptureProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setVibe } = useChameleon();

    // Handle file selection
    const processImage = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setPreview(dataUrl);
        };
        reader.readAsDataURL(file);

        setIsProcessing(true);
        setError(null);

        try {
            // Convert to base64
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    // Extract base64 data (remove data:image/xxx;base64, prefix)
                    const base64Data = result.split(',')[1];
                    resolve(base64Data);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Send to API for analysis
            const response = await fetch('/api/chameleon/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64,
                    mimeType: file.type,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze image');
            }

            const data = await response.json();

            // Apply the extracted vibe
            if (data.vibe) {
                // Use the description to generate a proper vibe
                await setVibe(`Clone the style of this design: ${data.description || 'modern clean interface'}`);
                onCapture?.(base64);
                onClose?.();
            }
        } catch (err) {
            console.error('Screenshot analysis failed:', err);
            setError('Failed to analyze screenshot. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    }, [setVibe, onCapture, onClose]);

    // Drag and drop handlers
    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processImage(files[0]);
        }
    };

    // File input handler
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processImage(files[0]);
        }
    };

    // Paste handler (for Cmd+V / Ctrl+V)
    const handlePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                if (file) {
                    processImage(file);
                    break;
                }
            }
        }
    }, [processImage]);

    // Show thinking bubble while processing
    if (isProcessing) {
        return (
            <div className={`vibe-capture ${className}`}>
                <ThinkingBubble
                    isThinking={true}
                    vibeType="style"
                    stepDelay={700}
                />
                {preview && (
                    <div style={{
                        marginTop: '12px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        opacity: 0.6,
                    }}>
                        <img
                            src={preview}
                            alt="Analyzing..."
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '150px',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={`vibe-capture ${className}`}
            onPaste={handlePaste}
            tabIndex={0}
        >
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--chameleon-primary, #4a90d9)' : 'rgba(128, 128, 128, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragging ? 'rgba(74, 144, 217, 0.05)' : 'transparent',
                    transition: 'all 150ms ease',
                }}
            >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    📸
                </div>
                <p style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--chameleon-text, #1a1a2e)'
                }}>
                    Drop screenshot here
                </p>
                <p style={{
                    margin: '4px 0 0',
                    fontSize: '12px',
                    opacity: 0.6
                }}>
                    or click to upload • Cmd+V to paste
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

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

            {/* Recent capture preview */}
            {preview && !isProcessing && (
                <div style={{
                    marginTop: '12px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <img
                        src={preview}
                        alt="Last captured"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '100px',
                            objectFit: 'cover',
                        }}
                    />
                    <button
                        onClick={() => setPreview(null)}
                        style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px',
                        }}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}
