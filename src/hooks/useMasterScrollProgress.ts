"use client";

/**
 * hooks/useMasterScrollProgress.ts
 *
 * Returns a single scroll-progress value (0–1) representing how far the user
 * has scrolled from the top to the bottom of the full page.
 *
 * ARCHITECTURE NOTE (Master Plan, Phase 3):
 * Scroll-progress calculations are CENTRALIZED here — never recomputed per-component.
 * All consumers (ProgressSpine, chapter timelines) subscribe to this single value.
 *
 * Implementation: Uses a ref-based approach with a callback to avoid React state
 * updates on every scroll tick (which would cause expensive re-renders).
 * The callback pattern lets GSAP/imperative code subscribe without React overhead.
 */

import { useEffect, useRef, useCallback } from "react";
import { useLenis } from "./useLenis";

type ProgressCallback = (progress: number) => void;

export function useMasterScrollProgress(onChange?: ProgressCallback) {
  const progressRef = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ progress }: { progress: number }) => {
      progressRef.current = progress;
      onChange?.(progress);
    };

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis, onChange]);

  // Returns the current progress ref (not reactive — read imperatively or via onChange)
  return progressRef;
}

/**
 * React-state version — use ONLY when you need reactive re-renders from progress.
 * For GSAP/canvas/imperative code, always use the callback form above.
 */
export function useMasterScrollProgressState() {
  const progressRef = useRef(0);
  const listenersRef = useRef<Set<ProgressCallback>>(new Set());

  const subscribe = useCallback((cb: ProgressCallback) => {
    listenersRef.current.add(cb);
    return () => listenersRef.current.delete(cb);
  }, []);

  return { progressRef, subscribe };
}
