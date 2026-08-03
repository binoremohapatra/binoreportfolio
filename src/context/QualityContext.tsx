'use client';

/**
 * context/QualityContext.tsx
 *
 * Single source of truth for device performance tier.
 * KEY DESIGN: defaults to 'low' so NO heavy component (WebGL, iframes,
 * 3D orbit) mounts on the first SSR/hydration render.
 * After first useEffect, tier upgrades to the real detected value.
 *
 * IMPORTANT - scroll-scrubbed video is always enabled on every tier.
 * Video seeking is natively hardware-accelerated even on weak devices.
 * What we gate are the truly expensive operations:
 *   - WebGL canvas (DNA helix)
 *   - Live iframes (network + render cost)
 *   - 23-card 3D rotationY/Z transforms (layout thrashing on weak GPUs)
 *
 * ?tier=low|medium|high query param overrides for testing.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type QualityTier = 'low' | 'medium' | 'high';

export interface QualityInfo {
  tier: QualityTier;
  // Video scrubbing: ALWAYS TRUE - seeking is cheap on all hardware
  allowScrollScrub: true;
  // On LOW tier, force useWebCodecs=false (seek-based, no frame-cache)
  useWebCodecs: boolean;
  // WebGL: false on low (DNA helix uses SVG fallback)
  allowWebGL: boolean;
  // Live iframes: high tier only - most expensive, network-dependent
  allowLiveIframes: boolean;
  // 3D orbit transforms (rotationY/Z): false on low, grid layout instead
  allow3DOrbit: boolean;
  // Blur filters: false on low (SVG filters expensive on mobile GPUs)
  allowBlur: boolean;
  // true once client detection has completed
  isReady: boolean;
}

const defaultQuality: QualityInfo = {
  tier: 'low',
  allowScrollScrub: true,  // always true
  useWebCodecs: false,
  allowWebGL: false,
  allowLiveIframes: false,
  allow3DOrbit: false,
  allowBlur: false,
  isReady: false,
};

export const QualityContext = createContext<QualityInfo>(defaultQuality);
export const useAdaptiveQuality = () => useContext(QualityContext);

function tierToFlags(tier: QualityTier): QualityInfo {
  return {
    tier,
    allowScrollScrub: true,                  // all tiers
    useWebCodecs:     tier !== 'low',         // low: seek-only scrub
    allowWebGL:       tier !== 'low',         // low: SVG DNA helix
    allowLiveIframes: tier === 'high',        // high only
    allow3DOrbit:     tier !== 'low',         // low: flat grid layout
    allowBlur:        tier !== 'low',         // low: no backdrop-filter
    isReady: true,
  };
}

function computeQuality(): QualityInfo {
  try {
    // ?tier= override for easy cross-device testing
    const urlTier = new URLSearchParams(window.location.search).get('tier') as QualityTier | null;
    if (urlTier === 'low' || urlTier === 'medium' || urlTier === 'high') {
      console.log('[Quality] Override:', urlTier);
      return tierToFlags(urlTier);
    }

    // prefers-reduced-motion -> low
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('[Quality] low (reduced-motion)');
      return tierToFlags('low');
    }

    // Mobile viewport -> low
    // (video still scrubs, but no 3D orbit / WebGL / iframes)
    const vw = window.innerWidth;
    if (vw < 768) {
      console.log('[Quality] low (mobile vw=' + vw + ')');
      return tierToFlags('low');
    }

    // Scoring - generous thresholds so normal laptops reach medium/high
    let score = 0;
    const cores = navigator.hardwareConcurrency ?? 4;
    // 4+ cores is common on even budget laptops -> earns a point
    if (cores >= 8) score += 2; else if (cores >= 4) score += 1;

    const memory = (navigator as any).deviceMemory as number | undefined;
    if (memory !== undefined) {
      if (memory >= 8) score += 2; else if (memory >= 4) score += 1;
    } else {
      // No memory API (Firefox, Safari) -> generous +1 on desktop
      score += 1;
    }
    if (vw >= 1280) score += 1;

    // score 2+ -> medium (catches i3/4-core laptops correctly)
    // score 4+ -> high
    const tier: QualityTier = score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low';
    console.log('[Quality] ' + tier + ' (cores=' + cores + ' mem=' + (memory ?? 'n/a') + ' vw=' + vw + ' score=' + score + ')');
    return tierToFlags(tier);
  } catch (e) {
    console.warn('[Quality] Detection error, defaulting low:', e);
    return tierToFlags('low');
  }
}

export function QualityProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQuality] = useState<QualityInfo>(defaultQuality);

  useEffect(() => {
    // Runs exactly once after first client render - no repeated calls
    setQuality(computeQuality());
  }, []);

  return (
    <QualityContext.Provider value={quality}>
      {children}
    </QualityContext.Provider>
  );
}
