'use client';

/**
 * context/QualityContext.tsx
 *
 * Single source of truth for device performance tier.
 * KEY DESIGN: defaults to 'low' so NO heavy component (ScrollyVideo,
 * WebGL, iframes) ever mounts on the first SSR/hydration render.
 * After first useEffect, tier upgrades to the real detected value.
 *
 * ?tier=low|medium|high query param overrides for testing.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type QualityTier = 'low' | 'medium' | 'high';

export interface QualityInfo {
  tier: QualityTier;
  allowScrollScrub: boolean;  // false on 'low'
  allowWebGL: boolean;        // false on 'low'
  allowLiveIframes: boolean;  // true on 'high' only
  allowBlur: boolean;         // false on 'low'
  isReady: boolean;           // false until client detection runs
}

const defaultQuality: QualityInfo = {
  tier: 'low',
  allowScrollScrub: false,
  allowWebGL: false,
  allowLiveIframes: false,
  allowBlur: false,
  isReady: false,
};

export const QualityContext = createContext<QualityInfo>(defaultQuality);
export const useAdaptiveQuality = () => useContext(QualityContext);

function tierToFlags(tier: QualityTier): QualityInfo {
  return {
    tier,
    allowScrollScrub: tier !== 'low',
    allowWebGL:       tier !== 'low',
    allowLiveIframes: tier === 'high',
    allowBlur:        tier !== 'low',
    isReady: true,
  };
}

function computeQuality(): QualityInfo {
  try {
    // Query-param override for easy testing
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
    const vw = window.innerWidth;
    if (vw < 768) {
      console.log('[Quality] low (mobile vw=' + vw + ')');
      return tierToFlags('low');
    }

    // Scoring
    let score = 0;
    const cores = navigator.hardwareConcurrency ?? 4;
    if (cores >= 8) score += 2; else if (cores >= 4) score += 1;

    const memory = (navigator as any).deviceMemory as number | undefined;
    if (memory !== undefined) {
      if (memory >= 8) score += 2; else if (memory >= 4) score += 1;
    } else {
      score += 1; // desktop with no memory API gets benefit of doubt
    }
    if (vw >= 1280) score += 1;

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
    // Runs exactly once after first client render
    setQuality(computeQuality());
  }, []);

  return (
    <QualityContext.Provider value={quality}>
      {children}
    </QualityContext.Provider>
  );
}
