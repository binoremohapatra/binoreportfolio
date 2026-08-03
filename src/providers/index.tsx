"use client";

import { ReactNode } from "react";
import { LenisProvider } from "./LenisProvider";
import { ReducedMotionProvider } from "./ReducedMotionProvider";
import { ThemeProvider } from "next-themes";
import { QualityProvider } from "@/context/QualityContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QualityProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ReducedMotionProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ReducedMotionProvider>
      </ThemeProvider>
    </QualityProvider>
  );
}
