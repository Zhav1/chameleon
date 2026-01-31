// Schema & Types
export type { VibeType, FontFamily, LayoutStyle, VoiceTone } from './schema';
export { VibeSchema, ALLOWED_FONTS, ALLOWED_LAYOUTS, ALLOWED_TONES } from './schema';

// Fonts & Defaults
export { fontMap, getAllFontVariables } from './fonts';
export { DEFAULT_VIBE, PRESET_VIBES } from './defaults';

// Components (re-exported from components folder)
export {
    // Core Provider & Hooks
    ChameleonRoot,
    useChameleon,
    // Layout & Morphing
    MorphLayout,
    MorphCard,
    MorphButton,
    MorphText,
    MorphHeading,
    // Input Components (v1)
    VibeInput,
    VibePresets,
    // Widget System (v2 - Competition Ready)
    ChameleonWidget,
    VibePopover,
    ReadingModeSelector,
    CustomVibeInput,
    // Loading States
    SkeletonMorph,
    SkeletonMorphContent,
    // Visible AI Thinking
    ThinkingBubble,
    useThinkingState,
    // Multimodal Input
    VibeCapture,
    VoiceVibe,
} from '../../components/chameleon';


