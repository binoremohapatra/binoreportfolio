/**
 * animations/timelines/signalTimeline.ts
 *
 * CHAPTER I "SIGNAL" — SVG name stroke-draw master timeline.
 * This is the canonical pattern reused in Ch.II, V, VII.
 *
 * Sequence:
 *  0.00–0.10  Signal Line draws left → right beneath the name
 *  0.10–0.70  "BINORE" strokes in character by character (stagger)
 *  0.65–0.80  Weight Seam fires on the specified character (thin → display weight)
 *  0.75–0.90  Subtitle fades in from below
 *  0.90–1.00  Exit stroke: all elements dissolve as section exits
 *
 * Stroke-draw technique:
 *   1. Each letter rendered as SVG <text> with stroke
 *   2. dasharray = getComputedTextLength() (measured after mount)
 *   3. dashoffset animated from length → 0 (draws the stroke)
 *   4. Fill simultaneously fades from 0 → 1, slightly offset
 *
 * Weight Seam technique:
 *   - The seam character's font-weight is animated from 300 → 900
 *     via a CSS variable on a variable font axis
 *   - Since we're using Inter (fallback), we swap between two font-weight values
 *     with a clip-path split: left half stays thin, right half becomes bold
 */

import { gsap, ScrollTrigger } from '../easings';
import { easeSignal, easeCine, easeInstrument } from '../easings';

export interface SignalRefs {
  section: HTMLElement;
  pin: HTMLElement;
  signalLine: SVGLineElement;
  letters: SVGTextElement[];
  seamChar: SVGTextElement;       // The Weight Seam character
  seamCharBold: SVGTextElement;   // Bold overlay that fades in over seamChar
  subtitle: HTMLElement;
  exitOverlay: HTMLElement;
}

export interface SignalTimelineOptions {
  /** Duration multiplier for reduced-motion mode — use 0.001 to skip */
  durationScale?: number;
}

/**
 * Creates the Chapter I Signal master timeline.
 * Must be called inside a gsap.context() block for proper cleanup.
 * Accepts pre-measured dashLengths array (from getComputedTextLength per letter).
 */
export function createSignalTimeline(
  refs: SignalRefs,
  dashLengths: number[],
  options: SignalTimelineOptions = {}
): gsap.core.Timeline {
  const { durationScale = 1 } = options;
  const d = (v: number) => v * durationScale; // Apply reduced-motion scale

  const { section, pin, signalLine, letters, seamChar, seamCharBold, subtitle, exitOverlay } = refs;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin,
      scrub: 1,
      anticipatePin: 1,
    },
  });

  // ── Signal Line draws ────────────────────────────────────────────────
  const lineLen = (signalLine as unknown as SVGGeometryElement).getTotalLength?.() ?? 1000;
  gsap.set(signalLine, {
    attr: { 'stroke-dasharray': lineLen, 'stroke-dashoffset': lineLen },
  });
  tl.to(
    signalLine,
    { attr: { 'stroke-dashoffset': 0 }, duration: d(0.12), ease: easeSignal }
  );

  // ── Letters stroke-draw in ────────────────────────────────────────────
  letters.forEach((letter, i) => {
    const len = dashLengths[i] ?? 200;
    gsap.set(letter, {
      attr: { 'stroke-dasharray': len, 'stroke-dashoffset': len },
      fillOpacity: 0,
    });

    tl.to(
      letter,
      { attr: { 'stroke-dashoffset': 0 }, duration: d(0.1), ease: easeSignal },
      i === 0 ? '>' : `>-${d(0.06)}`  // Slight overlap for fluid stagger
    ).to(
      letter,
      { fillOpacity: 1, duration: d(0.08), ease: easeCine },
      '<+0.04'
    );
  });

  // ── Weight Seam fires ────────────────────────────────────────────────
  tl.fromTo(
    seamCharBold,
    { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      duration: d(0.14),
      ease: easeInstrument,
    },
    `>-${d(0.1)}`
  );

  // ── Subtitle reveals ─────────────────────────────────────────────────
  tl.fromTo(
    subtitle,
    { y: 16, opacity: 0 },
    { y: 0, opacity: 1, duration: d(0.12), ease: easeSignal },
    `>-${d(0.04)}`
  );

  // ── Exit: dissolve out ───────────────────────────────────────────────
  tl.to(
    [pin, signalLine],
    { opacity: 0, duration: d(0.1), ease: easeCine },
    `>`
  ).fromTo(
    exitOverlay,
    { opacity: 0 },
    { opacity: 1, duration: d(0.1), ease: easeCine },
    '<'
  );

  return tl;
}
