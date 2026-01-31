'use client';

import { type ReactNode, type CSSProperties } from 'react';

interface SkeletonMorphProps {
    /** Type of skeleton to render */
    type?: 'text' | 'heading' | 'paragraph' | 'card' | 'button' | 'image';
    /** Width of the skeleton (CSS value) */
    width?: string;
    /** Height of the skeleton (CSS value) */
    height?: string;
    /** Number of lines for paragraph type */
    lines?: number;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
    /** Whether to show the shimmer animation */
    animate?: boolean;
    /** Children to wrap - if loading is false, show children */
    children?: ReactNode;
    /** Loading state */
    isLoading?: boolean;
}

/**
 * SkeletonMorph - Loading shimmer component for the Chameleon SDK
 * 
 * Shows elegant loading states while AI morphs the content.
 */
export function SkeletonMorph({
    type = 'text',
    width,
    height,
    lines = 3,
    className = '',
    style = {},
    animate = true,
    children,
    isLoading = true,
}: SkeletonMorphProps) {
    // If not loading and has children, render children
    if (!isLoading && children) {
        return <>{children}</>;
    }

    const baseStyle: CSSProperties = {
        background: 'linear-gradient(90deg, rgba(128, 128, 128, 0.1) 25%, rgba(128, 128, 128, 0.2) 50%, rgba(128, 128, 128, 0.1) 75%)',
        backgroundSize: '200% 100%',
        animation: animate ? 'skeletonShimmer 1.5s infinite' : 'none',
        borderRadius: '4px',
        ...style,
    };

    const renderSkeleton = () => {
        switch (type) {
            case 'heading':
                return (
                    <div
                        className={`skeleton-heading ${className}`}
                        style={{
                            ...baseStyle,
                            width: width || '70%',
                            height: height || '32px',
                        }}
                    />
                );

            case 'paragraph':
                return (
                    <div className={`skeleton-paragraph ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Array.from({ length: lines }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    ...baseStyle,
                                    width: i === lines - 1 ? '60%' : '100%',
                                    height: height || '16px',
                                }}
                            />
                        ))}
                    </div>
                );

            case 'card':
                return (
                    <div
                        className={`skeleton-card ${className}`}
                        style={{
                            ...baseStyle,
                            width: width || '100%',
                            height: height || '200px',
                            borderRadius: '12px',
                        }}
                    />
                );

            case 'button':
                return (
                    <div
                        className={`skeleton-button ${className}`}
                        style={{
                            ...baseStyle,
                            width: width || '120px',
                            height: height || '40px',
                            borderRadius: '8px',
                        }}
                    />
                );

            case 'image':
                return (
                    <div
                        className={`skeleton-image ${className}`}
                        style={{
                            ...baseStyle,
                            width: width || '100%',
                            height: height || '160px',
                            borderRadius: '8px',
                        }}
                    />
                );

            case 'text':
            default:
                return (
                    <span
                        className={`skeleton-text ${className}`}
                        style={{
                            ...baseStyle,
                            display: 'inline-block',
                            width: width || '100px',
                            height: height || '16px',
                        }}
                    />
                );
        }
    };

    return (
        <>
            {renderSkeleton()}
            <style jsx global>{`
                @keyframes skeletonShimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </>
    );
}

/**
 * SkeletonMorphContent - A wrapper for content that morphs with loading state
 */
export function SkeletonMorphContent({
    isLoading,
    children,
    fallback,
}: {
    isLoading: boolean;
    children: ReactNode;
    fallback?: ReactNode;
}) {
    if (isLoading) {
        return (
            <div className="skeleton-morph-content" style={{
                position: 'relative',
                opacity: 0.6,
                pointerEvents: 'none',
            }}>
                {fallback || (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <SkeletonMorph type="heading" />
                        <SkeletonMorph type="paragraph" lines={4} />
                    </div>
                )}
            </div>
        );
    }

    return <>{children}</>;
}
