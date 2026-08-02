/**
 * animations/primitives/seamClose.ts
 *
 * THE SEAM CLOSE — The site's initial load animation.
 * Two halves (top and bottom) that zipper-interlock and slide together,
 * transitioning from the loading state to the first chapter.
 *
 * Scarcity rules (Part 8):
 * ✓ MUST appear: initial site load ONLY.
 * ✓ CAN appear: heavy-asset transitions (Ch.IV WebGL load).
 * ✗ MUST NEVER: repeat/loop decoratively, or appear on lightweight transitions.
 * ✗ MUST NEVER: fake a loading delay to show off the motif.
 *
 * The zipper geometry:
 *   - Top panel: slides DOWN from -100% to 0 (covering the screen)
 *   - Bottom panel: slides UP from +100% to 0 (meeting the top)
 *   - They meet at center (the seam), hold for a beat, then simultaneously
 *     reverse — top slides UP to -100%, bottom slides DOWN to +100%
 *   - A FaultLine SVG traces the seam at the moment of contact
 *
 * The `seamClose()` function plays the full sequence and calls onComplete
 * when the reveal is done. This is what app/loading.tsx will call.
 */

import { gsap } from "gsap";
import { easeCine, easeSignal } from "../easings";
import { DURATION } from "@/lib/constants";

export interface SeamCloseOptions {
  /** Called when the animation completes and the page is revealed */
  onComplete?: () => void;
  /** Skip the animation (e.g., reduced-motion mode — just call onComplete) */
  skip?: boolean;
  /** Override the default seam color */
  color?: string;
}

/**
 * Creates the DOM elements for the Seam Close and appends them to document.body.
 * Returns a cleanup function that removes the elements.
 */
export function seamClose(options: SeamCloseOptions = {}): () => void {
  const { onComplete, skip = false, color = "#050505" } = options;

  if (skip) {
    onComplete?.();
    return () => {};
  }

  // ─── Create DOM panels ────────────────────────────────────────────────
  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText = `
    position: fixed; inset: 0; z-index: 9990;
    pointer-events: none; overflow: hidden;
  `;

  const topPanel = document.createElement("div");
  topPanel.style.cssText = `
    position: absolute; top: 0; left: 0; right: 0;
    height: 50%; background: ${color};
    transform: translateY(-100%);
  `;

  const bottomPanel = document.createElement("div");
  bottomPanel.style.cssText = `
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 50%; background: ${color};
    transform: translateY(100%);
  `;

  // FaultLine seam — a 1px horizontal line at the meeting point
  const seamLine = document.createElement("div");
  seamLine.style.cssText = `
    position: absolute; top: 50%; left: 0; right: 0;
    height: 1px; background: var(--border, #222); opacity: 0;
    transform: scaleX(0); transform-origin: left center;
  `;

  // Logo/identity mark at center of seam — monogram "B"
  const mark = document.createElement("div");
  mark.textContent = "B";
  mark.style.cssText = `
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-serif, serif);
    font-size: 18px; letter-spacing: 0.3em;
    color: var(--border, #222);
    opacity: 0;
  `;

  wrap.appendChild(topPanel);
  wrap.appendChild(bottomPanel);
  wrap.appendChild(seamLine);
  wrap.appendChild(mark);
  document.body.appendChild(wrap);

  // ─── Timeline ─────────────────────────────────────────────────────────
  const tl = gsap.timeline({
    onComplete: () => {
      wrap.remove();
      onComplete?.();
    },
  });

  // Phase 1: Panels close in (zipper shut)
  tl.to(
    topPanel,
    { y: "0%", duration: DURATION.cinematic / 1000, ease: easeCine },
    0
  )
    .to(
      bottomPanel,
      { y: "0%", duration: DURATION.cinematic / 1000, ease: easeCine },
      0
    )

    // Seam materialises at the moment of contact
    .to(
      seamLine,
      { opacity: 1, scaleX: 1, duration: 0.3, ease: easeSignal },
      `>-0.1`
    )
    .to(mark, { opacity: 1, duration: 0.2, ease: easeSignal }, "<")

    // Hold at center — the seam beat
    .to({}, { duration: 0.5 })

    // Phase 2: Panels open (reveal the page)
    .to(seamLine, { opacity: 0, scaleX: 0, duration: 0.2, ease: "power2.in" })
    .to(mark, { opacity: 0, duration: 0.2, ease: "power2.in" }, "<")
    .to(
      topPanel,
      { y: "-100%", duration: DURATION.cinematic / 1000, ease: easeCine },
      ">"
    )
    .to(
      bottomPanel,
      { y: "100%", duration: DURATION.cinematic / 1000, ease: easeCine },
      "<"
    );

  return () => {
    tl.kill();
    wrap.remove();
  };
}
