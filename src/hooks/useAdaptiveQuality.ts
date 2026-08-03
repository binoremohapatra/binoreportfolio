/**
 * hooks/useAdaptiveQuality.ts
 *
 * Thin re-export hook that consumes QualityContext.
 * Usage: const { tier, allowWebGL, allowScrollScrub, allowLiveIframes } = useAdaptiveQuality();
 */
export { useAdaptiveQuality } from '@/context/QualityContext';
export type { QualityTier, QualityInfo } from '@/context/QualityContext';
