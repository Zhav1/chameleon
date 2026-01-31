# PRD V3.0: PROJECT CHAMELEON

## "The Polymorphic Interface Engine" - Competition Edition

> **Vision:** One icon. One click. Infinite experiences.  
> **Target:** International Gemini AI Competition

---

## 1. Core Philosophy & Constraints

### The Rules

1. **No-Jargon Rule**: Never expose raw CSS or prompts to end-users
2. **Speed Rule**: Visual changes must happen in <400ms (perceived)
3. **Safety Rule**: AI cannot generate invalid fonts/colors (Zod enforced)
4. **Wow Rule**: Every demo must have a "holy sh*t" moment

---

## 2. Core UX Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  DEFAULT VIEW                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 📱 docs.myapp.com                             [🦎] [🌙]       │  │
│  │  # Getting Started                                            │  │
│  │  Welcome to our documentation...                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                          Chameleon icon in navbar   │
├─────────────────────────────────────────────────────────────────────┤
│  USER CLICKS 🦎                                                     │
│  ┌──────────────────────────────────────┐                          │
│  │  ✨ How do you want to read this?    │                          │
│  │                                      │                          │
│  │  [👶 Simple] [🎓 Expert] [🎨 Visual] │                          │
│  │                                      │                          │
│  │  ─────────── or ───────────          │                          │
│  │                                      │                          │
│  │  [ Explain like I'm a gamer... ]     │                          │
│  │                                      │                          │
│  │  [📸 Paste Screenshot] [🎤 Voice]    │                          │
│  │                           [Apply ✨] │                          │
│  └──────────────────────────────────────┘                          │
├─────────────────────────────────────────────────────────────────────┤
│  RESULT: INSTANT MORPH                                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 📱 docs.myapp.com               [🦎 Gamer Mode] [🌙]         │  │
│  │                                                               │  │
│  │  🧠 "Analyzing gaming culture... adjusting vocabulary..."    │  │
│  │                                                               │  │
│  │  # Let's Go! 🎮                                               │  │
│  │  Ready to level up? This is your power-up guide...           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                        Colors + Fonts + CONTENT all adapt          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Competition "Wow" Features

### 3.1 Visible AI Thinking 🧠

Show the AI reasoning in real-time (not just the result):

```
🧠 "Detecting formal tone..."
🧠 "Simplifying technical jargon..."
🧠 "Adding gaming metaphors..."
🧠 "Adjusting color temperature..."
```

**Gemini Feature:** `thinking_level` streaming

### 3.2 Screenshot-to-Vibe 📸

Clone any website's design language:

- User drops screenshot of Apple.com
- AI extracts: colors, fonts, spacing, mood
- Website transforms to match
**Gemini Feature:** Agentic Vision (zoom/inspect)

### 3.3 Voice-to-Vibe 🎤

Natural voice commands:

- "Make it feel like a cozy coffee shop"
- "I'm a 5 year old who loves dinosaurs"
**Gemini Feature:** Multimodal understanding

---

## 4. Technical Architecture

### 4.1 The Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (Strict) |
| AI SDK | Vercel AI SDK + @ai-sdk/google |
| Validation | Zod |
| Styling | Tailwind CSS + CSS Variables |
| Fonts | next/font/google |
| State | nuqs (URL params) + localStorage |

### 4.2 Gemini Models Used

| Model | Purpose | Feature |
| --- | --- | --- |
| `gemini-3-flash-preview` | Theme generation | Fast, <200ms |
| `gemini-3-pro-preview` | Content rewriting | Deep reasoning |
| Agentic Vision | Screenshot analysis | Zoom/inspect |
| `thinking_level` | Visible reasoning | Streaming thoughts |

### 4.3 Data Flow

```
User Input (text/voice/screenshot)
         ↓
    Orchestrator
         ↓
    ┌────┴────┐
    ↓         ↓
Theme Gen  Content Rewrite  ← Parallel Streams
    ↓         ↓
    └────┬────┘
         ↓
   Merge & Apply
         ↓
   UI Morphs (<400ms)
```

---

## 5. Data Schema (VibeType)

```typescript
const VibeSchema = z.object({
  themeName: z.string(),
  colors: z.object({
    primary: z.string().regex(/^#/),
    background: z.string().regex(/^#/),
    text: z.string().regex(/^#/),
    accent: z.string().regex(/^#/),
  }),
  typography: z.object({
    fontFamily: z.enum(['sans', 'serif', 'mono', 'display', 'hand']),
    baseSize: z.enum(['14px', '16px', '18px', '24px']),
  }),
  layout: z.object({
    style: z.enum(['standard', 'dense', 'hero']),
    borderRadius: z.string(),
  }),
  voice: z.object({
    tone: z.enum(['neutral', 'technical', 'simplified', 'storytelling']),
    emojiFrequency: z.enum(['none', 'low', 'high']),
  })
});
```

---

## 6. Component Library

### Core Components

| Component | Purpose |
| --- | --- |
| `ChameleonWidget` | Navbar 🦎 icon |
| `VibePopover` | Popup menu |
| `ReadingModeSelector` | Simple/Expert/Visual buttons |
| `CustomVibeInput` | Free text input |
| `ThinkingBubble` | AI reasoning display |
| `VibeCapture` | Screenshot drop zone |
| `VoiceVibe` | Microphone input |

### Layout Components

| Component | Purpose |
| --- | --- |
| `ChameleonRoot` | Context provider |
| `MorphLayout` | CSS variable injection |
| `MorphText` | Streaming content |
| `SkeletonMorph` | Loading shimmer |

---

## 7. Reading Modes

| Mode | Content Style | Visual Style |
| --- | --- | --- |
| **Simple** | Short sentences, analogies, emojis | Soft colors, rounded, large |
| **Expert** | Technical terms, references | Sharp, minimal, monospace |
| **Visual** | Bullet points, diagrams | Vibrant, modern, dynamic |
| **Custom** | AI interprets persona | AI generates theme |

---

## 8. SDK Distribution

### Target Usage

```tsx
// npm install @chameleon-ui/sdk

import { ChameleonProvider, ChameleonWidget } from '@chameleon-ui/sdk';

export default function App({ children }) {
  return (
    <ChameleonProvider apiKey={process.env.CHAMELEON_KEY}>
      <nav>
        <Logo />
        <ChameleonWidget />  {/* ← Just add this! */}
      </nav>
      {children}
    </ChameleonProvider>
  );
}
```

---

## 9. Implementation Phases

| Phase | Description | Hours |
| --- | --- | --- |
| 1 | Core Widget + Popup | 3-4h |
| 2 | Visible AI Thinking | 2-3h |
| 3 | Content Morphing | 3-4h |
| 4 | Screenshot-to-Vibe | 3-4h |
| 5 | Voice Input | 2h |
| 6 | SDK & Documentation | 2-3h |

**Total: ~16-20 hours**

---

## 10. Success Criteria

- ✅ User clicks 🦎 icon → popup appears
- ✅ Simple/Expert/Visual modes work
- ✅ Custom text input morphs content + style
- ✅ Screenshot paste → design cloned
- ✅ Voice input → natural transformation
- ✅ Visible "thinking" during AI processing
- ✅ <400ms perceived latency
- ✅ SDK installable via npm
