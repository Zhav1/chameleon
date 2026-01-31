'use client';

import { Suspense, useState } from 'react';
import {
    ChameleonRoot,
    MorphLayout,
    MorphCard,
    MorphButton,
    VibeInput,
    VibePresets,
    MorphText,
    useChameleon,
    ChameleonWidget
} from '@/components/chameleon';
import { DEFAULT_VIBE } from '@/lib/chameleon';

// Sample content for demonstration
const SAMPLE_CONTENT = {
    quantum: `Quantum computing harnesses the principles of quantum mechanics to process information in fundamentally different ways than classical computers. Unlike traditional bits that can only be 0 or 1, quantum bits (qubits) can exist in superposition, representing both states simultaneously. This enables quantum computers to perform certain calculations exponentially faster than their classical counterparts, particularly for problems involving optimization, cryptography, and molecular simulation.`,

    climate: `Climate change refers to long-term shifts in global temperatures and weather patterns. While natural factors like volcanic eruptions can influence climate, human activities have been the primary driver since the 1800s. The burning of fossil fuels releases greenhouse gases like carbon dioxide, which trap heat in the atmosphere. This has led to rising sea levels, more frequent extreme weather events, and disruptions to ecosystems worldwide.`,

    ai: `Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. Machine learning, a subset of AI, enables systems to learn from data without explicit programming. Deep learning uses neural networks with multiple layers to analyze complex patterns. Today, AI powers everything from recommendation systems to autonomous vehicles, though it also raises important questions about privacy, bias, and the future of work.`
};

function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full 
                       border-2 border-current/30 hover:border-current/60 transition-all"
        >
            {copied ? '✅ Copied!' : '🔗 Share Vibe'}
        </button>
    );
}

function DemoContent() {
    const { vibe, resetVibe } = useChameleon();
    const [selectedContent, setSelectedContent] = useState<keyof typeof SAMPLE_CONTENT>('quantum');

    // Add emoji based on frequency setting
    const getEmoji = () => {
        switch (vibe.voice.emojiFrequency) {
            case 'high': return '🎉✨🚀💫🌟';
            case 'low': return '✨';
            default: return '';
        }
    };

    return (
        <MorphLayout className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header with ChameleonWidget */}
                <header className="space-y-4">
                    {/* Navbar-style row with widget */}
                    <div className="flex items-center justify-between">
                        <div className="w-10" /> {/* Spacer */}
                        <h1 className="text-4xl md:text-5xl font-bold text-center">
                            {getEmoji()} Chameleon {getEmoji()}
                        </h1>
                        <ChameleonWidget position="navbar" />
                    </div>

                    <p className="text-xl opacity-80 text-center">
                        The Polymorphic Interface Engine
                    </p>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <span className="text-sm opacity-60">
                            Theme: <strong>{vibe.themeName}</strong>
                        </span>
                        <span className="text-sm opacity-40">|</span>
                        <span className="text-sm opacity-60">
                            Tone: <strong>{vibe.voice.tone}</strong>
                        </span>
                        <span className="text-sm opacity-40">|</span>
                        <ShareButton />
                    </div>
                </header>

                {/* Vibe Controls */}
                <MorphCard>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">🎨 Set Your Vibe</h2>
                        <button
                            onClick={resetVibe}
                            className="text-sm opacity-60 hover:opacity-100 underline"
                        >
                            Reset
                        </button>
                    </div>

                    <VibeInput
                        placeholder="Try: 'Make it look like a 90s hacker movie' or 'I'm a 5 year old'"
                        className="mb-6"
                    />

                    <div className="space-y-2">
                        <p className="text-sm opacity-70">Quick presets:</p>
                        <VibePresets />
                    </div>
                </MorphCard>

                {/* Adaptive Content Demo */}
                <MorphCard>
                    <h2 className="text-2xl font-semibold mb-4">
                        📄 Adaptive Content
                    </h2>

                    {/* Topic Selector */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {Object.keys(SAMPLE_CONTENT).map((key) => (
                            <MorphButton
                                key={key}
                                variant={selectedContent === key ? 'primary' : 'secondary'}
                                onClick={() => setSelectedContent(key as keyof typeof SAMPLE_CONTENT)}
                                className="text-sm"
                            >
                                {key === 'quantum' ? '⚛️ Quantum' : key === 'climate' ? '🌍 Climate' : '🤖 AI'}
                            </MorphButton>
                        ))}
                    </div>

                    {/* Morphing Text */}
                    <div className="prose max-w-none" style={{ color: 'inherit' }}>
                        <MorphText
                            originalText={SAMPLE_CONTENT[selectedContent]}
                            autoRewrite={true}
                        />
                    </div>

                    <p className="text-sm opacity-60 mt-4 border-t border-current/10 pt-4">
                        💡 <strong>Try it:</strong> Select &quot;Fun Zone&quot; preset to see content simplified for kids,
                        or &quot;Cyberpunk&quot; for technical jargon!
                    </p>
                </MorphCard>

                {/* Theme Debug Info */}
                <MorphCard>
                    <h2 className="text-2xl font-semibold mb-4">🔧 Theme Details</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="opacity-60">Font</p>
                            <p className="font-semibold capitalize">{vibe.typography.fontFamily}</p>
                        </div>
                        <div>
                            <p className="opacity-60">Layout</p>
                            <p className="font-semibold capitalize">{vibe.layout.style}</p>
                        </div>
                        <div>
                            <p className="opacity-60">Tone</p>
                            <p className="font-semibold capitalize">{vibe.voice.tone}</p>
                        </div>
                        <div>
                            <p className="opacity-60">Emoji</p>
                            <p className="font-semibold capitalize">{vibe.voice.emojiFrequency}</p>
                        </div>
                    </div>

                    {/* Color Swatches */}
                    <div className="mt-4 flex gap-2 flex-wrap">
                        {Object.entries(vibe.colors).map(([name, color]) => (
                            <div key={name} className="text-center">
                                <div
                                    className="w-12 h-12 rounded-lg border border-current/20 shadow-sm"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                                <p className="text-xs mt-1 opacity-60 capitalize">{name}</p>
                            </div>
                        ))}
                    </div>
                </MorphCard>

                {/* How It Works */}
                <MorphCard>
                    <h2 className="text-2xl font-semibold mb-4">⚡ How It Works</h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 rounded-lg bg-current/5">
                            <p className="font-semibold mb-2">🎨 Stream A: The Stylist</p>
                            <p className="opacity-70">
                                Gemini 1.5 Flash generates CSS variables in &lt;400ms,
                                instantly changing colors, fonts, and layout.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-current/5">
                            <p className="font-semibold mb-2">✍️ Stream B: The Editor</p>
                            <p className="opacity-70">
                                Gemini 1.5 Pro rewrites content to match your tone,
                                keeping facts while adapting complexity.
                            </p>
                        </div>
                    </div>
                </MorphCard>

                {/* Footer */}
                <footer className="text-center text-sm opacity-60 py-8 space-y-2">
                    <p>Built with Next.js 15 + Gemini AI + Vercel AI SDK</p>
                    <p className="text-lg">One URL, Infinite Experiences ✨</p>
                    <a
                        href="/"
                        className="inline-block mt-2 underline hover:no-underline"
                    >
                        ← Back to Home
                    </a>
                </footer>
            </div>
        </MorphLayout>
    );
}

export default function DemoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center space-y-4">
                    <div className="text-4xl animate-pulse">🦎</div>
                    <p className="text-slate-600">Loading Chameleon...</p>
                </div>
            </div>
        }>
            <ChameleonRoot initialVibe={DEFAULT_VIBE}>
                <DemoContent />
            </ChameleonRoot>
        </Suspense>
    );
}
