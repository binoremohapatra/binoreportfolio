/**
 * animations/timelines/prologueTimeline.ts
 *
 * PROLOGUE — Signal Point ignition sequence.
 * Factory function: takes DOM refs, creates and returns the pinned GSAP timeline.
 *
 * Sequence:
 *  0.00–0.08  Signal Point materialises (Handshake)
 *  0.08–0.20  Point pulses — two rings expand and dissolve
 *  0.20–0.50  Four FaultLine arms extend from the point to the edges
 *  0.50–0.72  Arms retract toward centre, point intensifies
 *  0.72–1.00  Point explodes into the name — dissolves into Chapter I
 *
 * Easing rules: signal (fast-in) for punctual events, cine (slow-in-out) for sustained moves.
 *
 * IMPORTANT: All ScrollTriggers created inside a gsap.context are automatically
 * killed when ctx.revert() is called on unmount. Always use context.
 */

import { gsap, ScrollTrigger } from '../easings';
import { easeSignal, easeCine } from '../easings';

export interface PrologueRefs {
  section: HTMLElement;
  pin: HTMLElement;
  point: HTMLElement;
  ring1: HTMLElement;
  ring2: HTMLElement;
  armTop: SVGLineElement;
  armRight: SVGLineElement;
  armBottom: SVGLineElement;
  armLeft: SVGLineElement;
  exitOverlay: HTMLElement;
}

/**
 * Creates the Prologue master timeline.
 * Must be called inside a gsap.context(() => { ... }, sectionRef) block.
 */
export function createPrologueTimeline(refs: PrologueRefs): gsap.core.Timeline {
  const { section, pin, point, ring1, ring2, armTop, armRight, armBottom, armLeft, exitOverlay } = refs;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=250%',
      pin,
      scrub: 1.2,
      anticipatePin: 1,
    },
  });

  // ── 0.00–0.08: Point arrives ────────────────────────────────────────────
  tl.fromTo(
    point,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.08, ease: easeSignal }
  );

  // ── 0.08–0.20: Double ring pulse ─────────────────────────────────────────
  tl.fromTo(
    ring1,
    { scale: 0, opacity: 0.6 },
    { scale: 4, opacity: 0, duration: 0.12, ease: easeCine }
  ).fromTo(
    ring2,
    { scale: 0, opacity: 0.4 },
    { scale: 6, opacity: 0, duration: 0.15, ease: easeCine },
    '<+0.03'
  );

  // ── 0.20–0.50: Arms extend ───────────────────────────────────────────────
  tl.fromTo(
    [armTop, armBottom],
    { attr: { y2: '50%' } },
    { attr: { y2: (i: number) => (i === 0 ? '0%' : '100%') }, duration: 0.3, ease: easeSignal, stagger: 0.04 },
    '<'
  ).fromTo(
    [armLeft, armRight],
    { attr: { x2: '50%' } },
    { attr: { x2: (i: number) => (i === 0 ? '0%' : '100%') }, duration: 0.3, ease: easeSignal, stagger: 0.04 },
    '<+0.02'
  );

  // ── 0.50–0.72: Arms retract ──────────────────────────────────────────────
  tl.to(
    [armTop, armBottom, armLeft, armRight],
    { opacity: 0, duration: 0.22, ease: easeCine, stagger: 0.03 },
    '>'
  ).to(
    point,
    { scale: 2.5, boxShadow: '0 0 0 1px rgba(255,255,255,0.6)', duration: 0.22, ease: easeSignal },
    '<'
  );

  // ── 0.72–1.00: Explosion into Chapter I ──────────────────────────────────
  tl.to(
    point,
    { scale: 0, opacity: 0, duration: 0.28, ease: 'power3.in' }
  ).fromTo(
    exitOverlay,
    { opacity: 0 },
    { opacity: 1, duration: 0.28, ease: easeCine },
    '<+0.1'
  );

  return tl;
}
