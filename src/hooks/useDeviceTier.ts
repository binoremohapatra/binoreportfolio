'use client';

/**
 * hooks/useDeviceTier.ts
 *
 * Classifies the current device into LOW / MEDIUM / HIGH performance tiers
 * using hardware signals (CPU cores, device memory, viewport width) and the
 * prefers-reduced-motion media query.
 *
 * Components can read the tier to adapt rendering complexity:
 *   LOW    → SVG fallbacks, no blur filters, minimal animation
 *   MEDIUM → Full layout, capped DPR/blur, simplified lighting
 *   HIGH   → Full experience, no reductions
 */

import { useState, useEffect } from 'react';

export type DeviceTier = 'LOW' | 'MEDIUM' | 'HIGH';

export interface DeviceTierInfo {
  tier: DeviceTier;
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
}

function computeTier(): DeviceTierInfo {
  // SSR safety — default to HIGH (will be recalculated on mount)
  if (typeof window === 'undefined') {
    return { tier: 'HIGH', isTouchDevice: false, prefersReducedMotion: false };
  }

  const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const prefersReducedMotion = mql ? mql.matches : false;

  // If the user explicitly wants reduced motion, always treat as LOW
  if (prefersReducedMotion) {
    return {
      tier: 'LOW',
      isTouchDevice: typeof window !== 'undefined' && ('ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)),
      prefersReducedMotion: true,
    };
  }

  // ── Scoring system: each signal votes for a tier ──────────────────────

  let lowVotes = 0;
  let midVotes = 0;
  let highVotes = 0;

  // 1. CPU cores
  const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : 4;
  if (cores < 4) lowVotes++;
  else if (cores < 8) midVotes++;
  else highVotes++;

  // 2. Device memory (non-standard, Chrome/Edge only)
  const memory = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory as number | undefined : undefined;
  if (memory !== undefined) {
    if (memory < 4) lowVotes++;
    else if (memory < 8) midVotes++;
    else highVotes++;
  }

  // 3. Viewport width as device-class proxy
  const vw = window.innerWidth;
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));

  // Force LOW tier for all mobile phones to save battery and ensure smooth rendering
  // regardless of how much RAM or CPU cores they have.
  if (vw < 768) {
    return { tier: 'LOW', isTouchDevice, prefersReducedMotion: false };
  }

  if (vw < 768) lowVotes++;
  else if (vw < 1280) midVotes++;
  else highVotes++;

  // ── Resolve tier: majority vote, ties break towards the lower tier ────
  let tier: DeviceTier;
  if (lowVotes >= midVotes && lowVotes >= highVotes) {
    tier = 'LOW';
  } else if (highVotes > midVotes && highVotes > lowVotes) {
    tier = 'HIGH';
  } else {
    tier = 'MEDIUM';
  }

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));

  return { tier, isTouchDevice, prefersReducedMotion: false };
}

/**
 * Returns the device's performance tier, whether it's a touch device,
 * and whether the user prefers reduced motion.
 *
 * The tier is computed once on mount and cached — it won't change during
 * the session (resize doesn't reclassify a laptop into a phone).
 */
export function useDeviceTier(): DeviceTierInfo {
  // Use SSR-safe default for initial render to prevent hydration mismatch
  const [info, setInfo] = useState<DeviceTierInfo>({
    tier: 'HIGH',
    isTouchDevice: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    // Recompute on mount (after client hydration is complete)
    setInfo(computeTier());

    // Listen for reduced-motion changes (user can toggle in OS settings)
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setInfo(computeTier());
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return info;
}
