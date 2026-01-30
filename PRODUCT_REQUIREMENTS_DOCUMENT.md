PRD V.2: PROJECT CHAMELEON
"The Polymorphic Interface Engine"

1. Core Philosophy & Constraints
The "No-Jargon" Rule: The system must never expose raw CSS or prompt engineering to the end-user.

The "Speed" Rule: Visual changes (Colors/Fonts) must happen in <400ms (Perceived Performance).

The "Safety" Rule: The AI cannot generate a font that we do not load, nor a color that is invisible. We enforce this via Zod Validation.

2. Technical Architecture & Data Flow
2.1 The "Parallel Morph" Pattern
We do not wait for the text to finish generating before we change the colors. We run two streams in parallel.

Stream A (The Vibe - Fast): Gemini 1.5 Flash -> Returns strictly formatted JSON -> Client updates CSS Variables.

Stream B (The Content - Smart): Gemini 1.5 Pro -> Returns Text Stream -> Client hydrates React Server Components (RSC).

2.2 The Tech Stack (Locked)
Framework: Next.js 15 (App Router)

Language: TypeScript (Strict)

AI SDK: Vercel AI SDK Core (ai) + Google Provider (@ai-sdk/google)

Validation: Zod (Crucial for preventing JSON hallucinations)

Styling: Tailwind CSS + CSS Variables (:root)

Fonts: next/font/google (Variable Fonts)

State: nuqs (URL Search Params for deep-linking vibes)

3. The "Safe Lists" (Anti-Hallucination Protocols)
To ensure the AI doesn't pick a font we don't have, we hardcode the available options in the System Prompt.

3.1 Allowed Fonts (Google Fonts) The AI must return one of these string keys:

"sans" -> Inter (Default/Clean)

"serif" -> Merriweather (Academic/Serious)

"mono" -> JetBrains Mono (Hacker/Technical)

"display" -> Bangers (Fun/Comic/Kids)

"hand" -> Patrick Hand (Casual/Note-taking)

3.2 Allowed Layout Modes The AI must return one of these string keys:

"standard" -> Single column, legible.

"dense" -> Multi-column, small text (Dashboard style).

"hero" -> Large text, center aligned (Storybook style).

4. Data Schemas (The Contract)
We use Zod to force Gemini to output valid JSON. If it fails validation, we fallback to default.

TypeScript

// /lib/chameleon/schema.ts
import { z } from 'zod';

export const VibeSchema = z.object({
  themeName: z.string().describe("A creative name for this theme, e.g. 'Cyberpunk'"),
  colors: z.object({
    primary: z.string().regex(/^#/, "Must be hex"),
    background: z.string().regex(/^#/, "Must be hex"),
    text: z.string().regex(/^#/, "Must be hex"),
    accent: z.string().regex(/^#/, "Must be hex"),
  }),
  typography: z.object({
    fontFamily: z.enum(['sans', 'serif', 'mono', 'display', 'hand']),
    baseSize: z.enum(['14px', '16px', '18px', '24px']),
  }),
  layout: z.object({
    style: z.enum(['standard', 'dense', 'hero']),
    borderRadius: z.string(), // e.g. "0.5rem" or "0px"
  }),
  voice: z.object({
    tone: z.enum(['neutral', 'technical', 'simplified', 'storytelling']),
    emojiFrequency: z.enum(['none', 'low', 'high']),
  })
});

export type VibeType = z.infer<typeof VibeSchema>;
5. Component Architecture (The "SDK")
This is how developers will use our tool.

5.1 <ChameleonRoot /> (The Provider)

Responsibility: Holds the VibeState. Connects to nuqs to sync vibe with URL (e.g., ?vibe=cyberpunk).

Context: Exposes setVibe(description: string).

5.2 <MorphLayout /> (The Container)

Responsibility: Injects the CSS variables into the DOM.

Mechanism:

TypeScript

<div style={{
  '--bg-primary': vibe.colors.background,
  '--text-primary': vibe.colors.text,
  '--font-main': fontMap[vibe.typography.fontFamily].style.fontFamily
}}>
  {children}
</div>
5.3 <MorphText /> (The Content)

Props: originalText: string, sourceUrl?: string

Mechanism:

On mount, it checks vibe.voice.tone.

If tone === 'neutral', it renders originalText.

If tone !== 'neutral', it calls streamText from Gemini Pro with the originalText + tone instructions.

6. System Instructions (The "Brain")
We need two distinct system prompts.

Prompt A: The Stylist (Gemini Flash)

Role: You are a CSS Variable Engine. Input: User description (e.g., "I'm a 5 year old"). Task: Map the input to the VibeSchema JSON. Constraints:

If "Child": Use 'display' font, 'hero' layout, 'high' emoji, bright colors.

If "Hacker": Use 'mono' font, 'dense' layout, 'none' emoji, green/black colors.

If "Academic": Use 'serif' font, 'standard' layout, 'none' emoji, paper/ink colors.

CRITICAL: You must output ONLY JSON. No markdown.

Prompt B: The Editor (Gemini Pro)

Role: You are an Adaptive Content Editor. Input: Original text + Target Tone + Target Audience. Task: Rewrite the text to match the tone. Constraints:

Truth: Do not change facts. Use Google Search Grounding to verify analogies.

Length: Keep it similar to the original length unless "Simplified" is requested.

Formatting: Use markdown.

7. Integration Guide (How to use)
To "distribute" this, we create a simple specific path.

Step 1: The Codebase You are building a Monorepo.

/lib/chameleon -> The SDK code.

/app/demo -> The showcase.

Step 2: The "Install" (Simulated) Since we are in a hackathon, we don't publish to NPM. We simulate it by importing from @/lib/chameleon.

Step 3: The Deep Link Your demo MUST support sharing.

User A sets "Vibe = Pirate".

User A copies URL: myapp.com/demo?vibe=pirate.

User B opens URL -> The site instantly loads in Pirate mode (Gemini Flash runs server-side on first load).

8. Implementation Roadmap
Phase 1: The Backbone (Now)

Initialize Next.js.

Install zod, ai, nuqs.

Set up the VibeSchema and Safe List fonts.

Phase 2: The Styling Engine (Next)

Build the generateVibe Server Action.

Connect it to Gemini Flash.

Test: Type "Red", see the background turn red.

Phase 3: The Content Engine (Final)

Build <MorphText>.

Connect it to Gemini Pro.

Test: Type "Explain Quantum Physics", toggle "Child Mode", see the text simplify.


PRD V1.0
Project Code Name: CHAMELEON (aka "Morph UI") Hackathon Track: Vibe Engineering / Innovation Version: 1.0 (Hackathon Release)

1. Executive Summary
The Problem: The World Wide Web is static. A Ph.D. physicist and a 12-year-old student see the exact same Wikipedia page, resulting in cognitive overload for one and boredom for the other. Accessibility is manual and retroactive. The Solution: A "Polymorphic Interface" that rewrites its content, redesigns its layout, and adjusts its aesthetic in real-time based on the user's intent and cognitive profile. The Value Prop: "One URL, Infinite Experiences."

2. Target Personas (The "Vibes")
We will build the demo to support 3 distinct, extreme personas to show contrast:

The "ELI5" (Explain Like I'm 5): Needs large text, colorful aesthetics (Comic Sans/Rounded), simplified analogies, and "Gamified" card layouts.

The "CTO/Hacker" (High Density): Needs "Cyberpunk/Terminal" aesthetics (Monospace/Green), dense data tables, bullet points, technical jargon, and deep architectural diagrams.

The "Academic" (The Default): Needs "New York Times" aesthetics (Serif), citations, neutral tone, and standard article layouts.

3. Functional Requirements
3.1 The "Vibe" Input Mechanism
REQ-1: System must accept a "Natural Language Trigger" (e.g., "Make this look like a 90s hacker movie").

REQ-2: System must interpret "Implicit Signals" (e.g., if a user asks a technical question, auto-shift to "Expert Mode").

3.2 Parallel Streaming Engine (The Core)
REQ-3 (The Visual Stream): System must utilize Gemini 1.5 Flash to generate a DesignTokenJSON object within <500ms.

Output: Color palette, Font family (Google Fonts), Border Radius, Layout density.

REQ-4 (The Content Stream): System must utilize Gemini 1.5 Pro to rewrite the core text content.

Constraint: Must retain the factual meaning of the original text while changing the tone.

3.3 The "Truth" Layer (Google Grounding)
REQ-5: When in "Simplified" modes, the Agent must use Google Search Grounding to verify that its analogies are accurate.

REQ-6: The UI must display a "Source Verification" badge/tooltip for any claims made in the rewritten text.

3.4 Persistence
REQ-7: User preferences (The "Vibe State") must be saved to Firebase Firestore so the design persists as they navigate between pages.

4. Technical Architecture
4.1 Stack
Frontend: Next.js 15 (App Router).

Language: TypeScript.

AI Integration: Vercel AI SDK Core (ai) + Google Provider (@ai-sdk/google).

Styling: Tailwind CSS (configured with CSS variables for dynamic theming).

Fonts: next/font/google (Variable fonts).

Backend: Next.js Server Actions (No separate Python backend needed, keeping latency low).

4.2 Data Flow (The "Morph" Loop)
User Action: User clicks "Vibe Toggle" -> ServerAction: setVibe('cyberpunk').

Server:

Call Gemini Flash: Prompt = "Generate CSS variables for 'cyberpunk' theme." -> Returns JSON.

Call Gemini Pro: Prompt = "Rewrite this article for a hacker audience." -> Returns Stream.

Client:

useStreamableValue hook receives CSS JSON -> Updates :root variables immediately.

useAIState hook receives text stream -> Replaces DOM nodes.

5. Detailed Data Models
5.1 The DesignSchema (JSON Output from Gemini Flash)
This is what the AI controls to change the look.

TypeScript

interface DesignSchema {
  themeName: string;         // e.g., "Cyberpunk 2077"
  primaryColor: string;      // e.g., "#00FF41"
  backgroundColor: string;   // e.g., "#0D0208"
  fontFamily: string;        // e.g., "Space Mono"
  borderRadius: string;      // e.g., "0px"
  layoutMode: "grid" | "list" | "hero";
  toneInstruction: string;   // e.g., "Use tech jargon and terse sentences."
}
6. System Instructions (Prompt Engineering Strategy)
We will use a "Dual-Agent" approach in the System Prompt.

Agent A (The Designer - Gemini Flash):

"You remain in JSON mode. You are an expert UI/UX designer. Your goal is to translate an abstract 'Vibe' (e.g., 'Cozy Cabin') into concrete CSS variables and Tailwind classes. Be bold. High contrast."

Agent B (The Writer - Gemini Pro):

"You are an expert editor. You will receive content and a target audience. Rewrite the content to match the audience's reading level.

Constraint 1: If audience is 'Child', use analogies involving animals/games.

Constraint 2: If audience is 'Expert', use technical terminology.

Constraint 3: NEVER hallucinate facts. Use the provided context."

7. The Hackathon Roadmap
Phase 1: The Skeleton (Day 1)
Setup Next.js 15 repo.

Configure Tailwind with CSS Variables (e.g., bg-[var(--bg-primary)]).

Create the "Vibe Slider" UI.

Integrate Gemini API key.

Phase 2: The Brain (Day 2)
Build the generateVibe() Server Action.

Implement the Google Fonts dynamic loader.

Connect Gemini 1.5 Flash for the JSON stream.

Milestone: The colors/fonts change when you type "Red".

Phase 3: The Polish (Day 3)
Implement "Generative UI" components (Cards vs. Lists).

Add the "Google Search Grounding" tool for the content rewrite.

The "Wow" Factor: Add animations/transitions so the change isn't jarring.

8. Risk & Mitigation
Risk: Gemini generates a font name that doesn't exist in Google Fonts.

Mitigation: Create a "Safe List" of 20 diverse fonts (5 Serif, 5 Sans, 5 Mono, 5 Display) and instruct Gemini to pick from the list rather than hallucinate new ones.

Risk: Content rewrite loses the original meaning.

Mitigation: Pass the original text as "Immutable Context" in the prompt and ask Gemini to output a "Confidence Score" with its rewrite.