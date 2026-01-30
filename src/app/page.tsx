import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center text-white space-y-8 max-w-3xl">
        {/* Hero */}
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
          Chameleon
        </h1>

        <p className="text-2xl md:text-3xl text-purple-200">
          The Polymorphic Interface Engine
        </p>

        <p className="text-lg text-slate-300 max-w-xl mx-auto">
          One URL, Infinite Experiences. AI-powered adaptive UI that morphs
          colors, fonts, and content to match your vibe.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold text-lg">Instant Styling</h3>
            <p className="text-sm text-slate-300 mt-2">
              Gemini Flash generates themes in &lt;400ms
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
            <div className="text-4xl mb-3">✍️</div>
            <h3 className="font-semibold text-lg">Adaptive Content</h3>
            <p className="text-sm text-slate-300 mt-2">
              Content rewrites to match your tone
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-semibold text-lg">Deep Linking</h3>
            <p className="text-sm text-slate-300 mt-2">
              Share your vibe via URL params
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold 
                       bg-gradient-to-r from-purple-500 to-pink-500 rounded-full
                       hover:from-purple-600 hover:to-pink-600 transition-all
                       hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
          >
            Try the Demo
            <span className="text-xl">→</span>
          </Link>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-sm text-slate-400">
          <p>Built with</p>
          <p className="mt-2 space-x-3">
            <span>Next.js 15</span>
            <span>•</span>
            <span>Gemini AI</span>
            <span>•</span>
            <span>Vercel AI SDK</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </p>
        </div>
      </div>
    </main>
  );
}
