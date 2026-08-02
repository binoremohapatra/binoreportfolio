"use client";

/**
 * components/ui/index.ts
 * Barrel export for all UI primitives.
 * Import from '@/components/ui' — not from individual files.
 */

// Design Language primitives
export { Notch } from './Notch';
export type { NotchProps } from './Notch';

export { SplitFrame } from './SplitFrame';
export type { SplitFrameProps } from './SplitFrame';

export { FaultLine } from './FaultLine';
export type { FaultLineProps } from './FaultLine';

// React Bits components (adapted to TypeScript)
export { default as SplitText } from './reactbits/SplitText';
export { default as BlurText } from './reactbits/BlurText';
export { TextPressure } from './TextPressure';
export { CircularText } from './CircularText';
export { VariableProximity } from './VariableProximity';

// Atlas UI components
export { ObserverSlider } from './observer-slider';

