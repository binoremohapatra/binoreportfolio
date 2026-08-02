/**
 * animations/primitives/stitchAlign.ts
 *
 * STITCH CURSOR ALIGNMENT UTILITY
 *
 * Drives the "align" behavior of the Stitch Cursor — when the cursor
 * approaches an interactive element, it snaps/aligns to the element's
 * nearest edge instead of floating freely.
 *
 * Used by: StitchCursor (Phase 3), any future cursor-aware interactive component.
 *
 * Implementation: Calculates the nearest point on the element's bounding rect
 * to the current cursor position, then applies a magnetic pull proportional
 * to proximity (0 at outer boundary, 1 at element center).
 */

import { gsap } from "gsap";
import { easeSignal } from "../easings";

export interface StitchAlignOptions {
  /** How many pixels outside the element the magnetic pull begins */
  pullRadius?: number;
  /** 0–1: how strongly the cursor is pulled toward the element at its center */
  strength?: number;
  /** Duration of the snap transition */
  duration?: number;
}

/**
 * Attaches magnetic cursor alignment to a DOM element.
 * Returns a cleanup function to call on unmount.
 */
export function attachStitchAlign(
  element: HTMLElement,
  cursorOuter: HTMLElement,
  cursorDot: HTMLElement,
  options: StitchAlignOptions = {}
): () => void {
  const { pullRadius = 60, strength = 0.35, duration = 0.3 } = options;

  let isHovering = false;

  const onMouseMove = (e: MouseEvent) => {
    if (!isHovering) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Calculate pull factor: 1 at element center, 0 at pullRadius
    const maxDist = Math.max(rect.width / 2 + pullRadius, rect.height / 2 + pullRadius);
    const pullFactor = Math.max(0, 1 - dist / maxDist) * strength;

    const pullX = dx * pullFactor;
    const pullY = dy * pullFactor;

    gsap.to(cursorOuter, {
      x: e.clientX - pullX,
      y: e.clientY - pullY,
      duration,
      ease: easeSignal,
      overwrite: "auto",
    });
  };

  const onMouseEnter = () => {
    isHovering = true;
    // Expand the outer ring
    gsap.to(cursorOuter, {
      scale: 1.8,
      opacity: 0.7,
      duration: 0.4,
      ease: easeSignal,
      overwrite: "auto",
    });
  };

  const onMouseLeave = () => {
    isHovering = false;
    gsap.to(cursorOuter, {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: easeSignal,
      overwrite: "auto",
    });
  };

  element.addEventListener("mouseenter", onMouseEnter);
  element.addEventListener("mouseleave", onMouseLeave);
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  return () => {
    element.removeEventListener("mouseenter", onMouseEnter);
    element.removeEventListener("mouseleave", onMouseLeave);
    window.removeEventListener("mousemove", onMouseMove);
  };
}
