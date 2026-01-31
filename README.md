# 🦎 Chameleon SDK

> **The Polymorphic Interface Engine** - AI-powered dynamic theming and content adaptation

[![npm version](https://img.shields.io/npm/v/@chameleon-sdk/react.svg)](https://www.npmjs.com/package/@chameleon-sdk/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🎨 Dynamic Theming** - AI generates colors, typography, and layouts based on natural language
- **📝 Content Adaptation** - Rewrites content to match the user's reading level (Simple/Expert/Visual)
- **🧠 Visible AI Thinking** - Shows real-time AI reasoning for transparency
- **📸 Screenshot-to-Vibe** - Drop a screenshot, AI clones the design language
- **🎤 Voice-to-Vibe** - "Make it cozy" → instant transformation
- **⚡ Streaming** - Parallel theme + content generation for <400ms perceived latency

## 🚀 Quick Start

### 1. Installation

```bash
npm install @chameleon-sdk/react
```

### 2. Add API Key

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### 3. Wrap Your App

```tsx
// app/layout.tsx
import { ChameleonRoot, MorphLayout } from '@chameleon-sdk/react';

export default function Layout({ children }) {
  return (
    <ChameleonRoot>
      <MorphLayout>{children}</MorphLayout>
    </ChameleonRoot>
  );
}
```

### 4. Add the Widget

```tsx
// In your navbar
import { ChameleonWidget } from '@chameleon-sdk/react';

export function Navbar() {
  return (
    <nav>
      <Logo />
      <ChameleonWidget position="navbar" />
    </nav>
  );
}
```

## 📦 Components

### Core

| Component | Description |
|-----------|-------------|
| `ChameleonRoot` | Context provider - wrap your app |
| `MorphLayout` | Applies theme styles to children |
| `ChameleonWidget` | The 🦎 navbar icon trigger |

### Widget System

| Component | Description |
|-----------|-------------|
| `VibePopover` | Popup menu with mode selection |
| `ReadingModeSelector` | Simple/Expert/Visual buttons |
| `CustomVibeInput` | Free text vibe input |
| `ThinkingBubble` | Animated AI reasoning display |

### Content

| Component | Description |
|-----------|-------------|
| `MorphText` | AI-rewritten streaming text |
| `MorphHeading` | Adaptive headings |
| `MorphCard` | Themed card container |
| `MorphButton` | Themed button |

### Multimodal

| Component | Description |
|-----------|-------------|
| `VibeCapture` | Screenshot drag/drop zone |
| `VoiceVibe` | Voice input button |
| `SkeletonMorph` | Loading shimmer states |

## 🎯 Reading Modes

```tsx
// Built-in presets
<ReadingModeSelector onSelect={onClose} />

// Modes:
// 👶 Simple - "Explain like I'm 8"
// 🎓 Expert - "Technical with jargon"
// 🎨 Visual - "Infographic style with emojis"
```

## 🔧 Hooks

```tsx
import { useChameleon } from '@chameleon-sdk/react';

function MyComponent() {
  const { vibe, setVibe, isLoading, resetVibe } = useChameleon();
  
  // vibe.colors.primary, vibe.typography.fontFamily, etc.
  // setVibe("Make it cyberpunk")
}
```

## 🎨 Custom Vibes

```tsx
// Natural language
await setVibe("Make this feel like a cozy coffee shop");
await setVibe("I'm a 5 year old who loves dinosaurs");
await setVibe("Corporate but not boring");

// The AI generates:
// - Color palette
// - Typography
// - Layout style
// - Voice/tone for content
```

## 📡 API Routes

Create these Next.js API routes:

```
/api/vibe         - Theme generation (Gemini Flash)
/api/rewrite      - Content adaptation (Gemini Pro)
/api/chameleon/analyze-image - Screenshot analysis
```

## 🛠️ Development

```bash
# Clone
git clone https://github.com/Zhav1/chameleon.git
cd chameleon

# Install
npm install

# Run demo
npm run dev

# Build SDK
npm run build:sdk
```

## 📄 License

MIT © Chameleon Team

---

**Built with ❤️ for the Gemini AI Competition**
