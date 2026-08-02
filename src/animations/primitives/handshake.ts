/**
 * animations/primitives/handshake.ts
 *
 * THE HANDSHAKE — The Design Language's signature approach-and-settle motion.
 *
 * Concept: Two things moving toward each other from opposite axes and settling
 * together. Not a bounce — a precise two-axis convergence.
 *
 * Usage contract (from Part 8 — Design Language Scarcity Rules):
 * ✓ MUST be used for: cursor hover-complete, icon-complete, chapter transitions, Ch.VII CTA settle.
 * ✗ MUST NEVER be used as a generic hover-scale/bounce substitute.
 *   If a hover doesn't represent "two things meeting," use a quiet transition instead.
 *
 * Function signature:
 *   handshake(target, options) → gsap.core.Tween
 *
 * The "two-axis" approach:
 *   - The element approaches from a slight offset in BOTH x AND y
 *   - It settles with an elastic-influenced ease (not a simple spring)
 *   - A brief counter-movement on the opposite axis adds the "shake" feel
 */

import { gsap } from "gsap";
import { easeHandshake } from "../easings";

export interface HandshakeOptions {
  /** Approach direction: which quadrant the element comes from. Default: "top-right" */
  from?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Approach distance in px on each axis. Default: 8 (--spacing-2 approx) */
  distance?: number;
  /** Total duration in seconds. Default: 0.7 */
  duration?: number;
  /** Start delay in seconds. Default: 0 */
  delay?: number;
  /** GSAP timeline to append this to instead of creating a standalone tween */
  timeline?: gsap.core.Timeline;
  /** Position in the parent timeline (only used if timeline is provided). Default: ">" */
  position?: string | number;
}

export function handshake(
  target: gsap.TweenTarget,
  options: HandshakeOptions = {}
): gsap.core.Tween | gsap.core.Timeline {
  const {
    from = "top-right",
    distance = 8,
    duration = 0.7,
    delay = 0,
    timeline,
    position = ">",
  } = options;

  // Determine approach direction vectors
  const xSign = from.includes("right") ? 1 : -1;
  const ySign = from.includes("top") ? -1 : 1;

  const fromX = xSign * distance;
  const fromY = ySign * distance;

  // The two-phase handshake:
  // Phase 1 (60% of duration): approach from offset on both axes
  // Phase 2 (40% of duration): micro counter-movement on opposite axis then settle
  const tl = gsap.timeline({ delay });

  tl.fromTo(
    target,
    {
      x: fromX,
      y: fromY,
      opacity: 0,
    },
    {
      x: 0,
      y: 0,
      opacity: 1,
      duration: duration * 0.6,
      ease: easeHandshake,
    }
  ).to(
    target,
    {
      // Micro counter-punch on Y — the "shake" component
      y: -ySign * distance * 0.15,
      duration: duration * 0.15,
      ease: "power2.in",
    },
    `>-${duration * 0.05}`
  ).to(
    target,
    {
      y: 0,
      duration: duration * 0.25,
      ease: easeHandshake,
    }
  );

  // If a parent timeline is provided, merge into it
  if (timeline) {
    return timeline.add(tl, position);
  }

  return tl;
}

/**
 * Reverse handshake — for departure/dismiss animations.
 * The element retreats back into the approach direction.
 */
export function handshakeOut(
  target: gsap.TweenTarget,
  options: Omit<HandshakeOptions, "timeline" | "position"> = {}
): gsap.core.Timeline {
  const {
    from = "top-right",
    distance = 8,
    duration = 0.4,
    delay = 0,
  } = options;

  const xSign = from.includes("right") ? 1 : -1;
  const ySign = from.includes("top") ? -1 : 1;

  return gsap.timeline({ delay }).to(target, {
    x: xSign * distance,
    y: ySign * distance,
    opacity: 0,
    duration,
    ease: "power3.in",
  });
}
