"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ReducedMotionContextType {
  prefersReducedMotion: boolean;
  manualReducedMotion: boolean;
  setManualReducedMotion: (val: boolean) => void;
  isReducedMotionActive: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextType | undefined>(undefined);

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualReducedMotion, setManualReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches !== prefersReducedMotion) {
      setPrefersReducedMotion(mediaQuery.matches);
    }
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isReducedMotionActive = prefersReducedMotion || manualReducedMotion;

  return (
    <ReducedMotionContext.Provider
      value={{
        prefersReducedMotion,
        manualReducedMotion,
        setManualReducedMotion,
        isReducedMotionActive,
      }}
    >
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion() {
  const context = useContext(ReducedMotionContext);
  if (context === undefined) {
    throw new Error("useReducedMotion must be used within a ReducedMotionProvider");
  }
  return context;
}
