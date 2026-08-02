/**
 * hooks/useLenis.ts
 *
 * Accesses the shared Lenis instance from LenisProvider context.
 * Returns null on server render (SSR-safe).
 *
 * Usage:
 *   const lenis = useLenis();
 *   lenis?.scrollTo('#signal', { duration: 1.4 });
 */

"use client";

import { useLenisInstance } from "@/providers/LenisProvider";

export function useLenis() {
  return useLenisInstance();
}
