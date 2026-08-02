/**
 * animations/easings.ts
 * Single source of truth for all named GSAP easing curves.
 * Import ONLY from here — never use inline easing strings in timeline files.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins once at module level (safe to call multiple times)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Named Easing Curves ──────────────────────────────────────────────────────
// These must match EASING in lib/constants.ts (CSS form) exactly in feel.

/** easeSignal: Fast start, elegant settle. Used for character reveals, signal line draws. */
export const easeSignal = 'power4.out';

/** easeCine: Slow in, slow out, cinematic weight. Used for chapter transitions. */
export const easeCine = 'power2.inOut';

/** easeInstrument: Precise ease-in-out. Used for gauges, data reveals, mechanical motions. */
export const easeInstrument = 'power3.inOut';

/** easeHandshake: Two-axis approach settle. Used for the Handshake motion primitive. */
export const easeHandshake = 'expo.out';

// Re-export gsap and ScrollTrigger for centralised consumption
export { gsap, ScrollTrigger };
