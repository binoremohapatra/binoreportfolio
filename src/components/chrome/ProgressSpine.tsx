"use client";

/**
 * components/chrome/ProgressSpine.tsx
 *
 * PROGRESS SPINE — The vertical scroll-progress instrument on the right edge.
 *
 * Phase 3 update: No longer owns its own scroll state.
 * Instead, accepts external refs from GlobalChrome that are driven imperatively
 * by GSAP (via useMasterScrollProgress callback) — zero React re-renders on scroll.
 */

import { RefObject } from 'react';

interface ProgressSpineProps {
  filledRef: RefObject<HTMLDivElement | null>;
  dotRef: RefObject<HTMLDivElement | null>;
}

export function ProgressSpine({ filledRef, dotRef }: ProgressSpineProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed right-6 top-0 h-full z-50 flex flex-col items-center justify-start pointer-events-none select-none"
      style={{ paddingBlock: 'var(--spacing-6, 68px)' }}
    >
      {/* Track line */}
      <div className="relative w-px flex-1 bg-border/20">
        {/* Filled portion — GSAP drives scaleY imperatively */}
        <div
          ref={filledRef}
          className="absolute inset-0 bg-primary/50 origin-top"
          style={{ transform: 'scaleY(0)' }}
        />
        {/* Travelling dot — GSAP drives top imperatively */}
        <div
          ref={dotRef}
          className="absolute left-1/2 w-[5px] h-[5px] rounded-full bg-primary"
          style={{
            top: '0%',
            transform: 'translateX(-50%) translateY(-50%)',
          }}
        />
      </div>
    </div>
  );
}

