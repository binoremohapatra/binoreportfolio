"use client";

/**
 * providers/LenisProvider.tsx
 *
 * Creates ONE Lenis instance for the entire app and exposes it via context.
 * Shares its RAF loop with GSAP's ticker (single rAF loop as per Master Plan Optimization).
 *
 * Import rule: only app/layout.tsx (via providers/index.tsx) imports this.
 * Other code accesses Lenis via the useLenis() hook.
 */

import { createContext, useContext, ReactNode, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Lenis Context ────────────────────────────────────────────────────────────
type LenisContextType = Lenis | null;
const LenisContext = createContext<LenisContextType>(null);

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  // Stable function ref so we can remove the exact same function from gsap.ticker
  const rafFnRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    // Register GSAP plugins once, here, at the root motion boundary
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.05, // Lower lerp makes it much smoother and "floaty"
      duration: 1.5,
      wheelMultiplier: 0.8, // Slightly slower scroll feels more premium
      smoothWheel: true,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });

    setLenisInstance(lenis);

    // Sync GSAP ScrollTrigger with Lenis on every scroll event
    lenis.on("scroll", ScrollTrigger.update);

    // Share the RAF loop — prevents two competing requestAnimationFrame loops
    const rafFn = (time: number) => lenis.raf(time * 1000);
    rafFnRef.current = rafFn;
    gsap.ticker.add(rafFn);

    // Eliminate GSAP lag-smoothing so Lenis's frame timing is authoritative
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (rafFnRef.current) {
        gsap.ticker.remove(rafFnRef.current);
      }
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
