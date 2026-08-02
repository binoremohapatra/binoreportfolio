"use client";

/**
 * chapters/signal/Signal.tsx
 *
 * CHAPTER I — "SIGNAL"
 *
 * Visual spec:
 * - SVG "BINORE" drawn character by character via stroke-dashoffset
 * - A FaultLine Signal Line draws first, beneath the name
 * - The "O" carries the Weight Seam — at stroke completion it flips to display weight
 * - Subtitle "FULL-STACK ENGINEER" reveals after the name is complete
 * - The section is pinned for ~300vh of scroll
 *
 * Pattern notes (for Ch.II, V, VII reuse):
 * 1. All letter SVGTextElements are measured via getComputedTextLength() after mount
 * 2. dasharray + dashoffset are set before the timeline runs
 * 3. The timeline factory (signalTimeline.ts) is used for the actual animation
 * 4. Exit uses opacity + exitOverlay, not clip-path (keeps exit smooth)
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { easeSignal, easeCine, easeInstrument } from "@/animations/easings";

// The name: each character gets its own <text> for independent stroke control.
const NAME_CHARS = ["B", "I", "N", "O", "R", "E"];
// Weight Seam fires on index 3 ("O") — the emotional character
const WEIGHT_SEAM_INDEX = 3;

export function Signal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const signalLineRef = useRef<SVGLineElement>(null);
  const letterRefs = useRef<(SVGTextElement | null)[]>([]);
  const boldOverlayRef = useRef<SVGTextElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef<HTMLDivElement>(null);

  const { isReducedMotionActive } = useReducedMotion();

  // Stable ref-setter for the letter array
  const setLetterRef = useCallback((el: SVGTextElement | null, i: number) => {
    letterRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const pin = pinRef.current!;
      const signalLine = signalLineRef.current!;
      const letters = letterRefs.current.filter(Boolean) as SVGTextElement[];
      const boldOverlay = boldOverlayRef.current!;
      const subtitle = subtitleRef.current!;
      const exitEl = exitRef.current!;

      // ── Reduced motion: static reveal ────────────────────────────────
      if (isReducedMotionActive) {
        gsap.set(letters, { fillOpacity: 1, attr: { strokeOpacity: 0 } });
        gsap.set(subtitle, { opacity: 1, y: 0 });
        return;
      }

      // ── Measure letter lengths (must happen after mount/paint) ────────
      const dashLengths = letters.map((el) => {
        const len = el.getComputedTextLength();
        // Set initial stroke state: drawn-off
        gsap.set(el, {
          attr: {
            'stroke-dasharray': len + 10,
            'stroke-dashoffset': len + 10,
          },
          fillOpacity: 0,
        });
        return len;
      });

      // ── Signal Line — measure and set ─────────────────────────────────
      const svg = svgRef.current!;
      const svgWidth = svg.getBoundingClientRect().width;
      gsap.set(signalLine, {
        attr: {
          'stroke-dasharray': svgWidth,
          'stroke-dashoffset': svgWidth,
        },
      });

      // ── Bold overlay for Weight Seam — hidden initially ───────────────
      gsap.set(boldOverlay, {
        opacity: 0,
        clipPath: 'inset(0 100% 0 0)',
      });

      // ── Initial states ─────────────────────────────────────────────────
      gsap.set(subtitle, { y: 20, opacity: 0 });
      gsap.set(exitEl, { opacity: 0 });

      // ── Master timeline ────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          pin,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Signal Line draws
      tl.to(signalLine, {
        attr: { 'stroke-dashoffset': 0 },
        duration: 0.1,
        ease: easeSignal,
      });

      // Letters stroke-draw with stagger
      letters.forEach((letter, i) => {
        const len = dashLengths[i];
        const isSeam = i === WEIGHT_SEAM_INDEX;
        const offset = i === 0 ? '>' : `>-0.05`;

        tl
          // Stroke draws in
          .to(letter, {
            attr: { 'stroke-dashoffset': 0 },
            duration: 0.09,
            ease: easeSignal,
          }, offset)
          // Fill fades in slightly after stroke passes
          .to(letter, {
            fillOpacity: isSeam ? 0.3 : 1, // Seam char stays faint until bold fires
            duration: 0.07,
            ease: easeCine,
          }, '<+0.04');

        // Weight Seam fires at this letter
        if (isSeam) {
          tl.to(boldOverlay, {
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.14,
            ease: easeInstrument,
          }, `>-0.06`)
            // Fade out the thin version as bold covers it
            .to(letter, { fillOpacity: 0, duration: 0.1, ease: easeCine }, '<');
        }
      });

      // Subtitle reveals
      tl.to(subtitle, {
        y: 0,
        opacity: 1,
        duration: 0.1,
        ease: easeSignal,
      }, '>-0.05');

      // Exit dissolve
      tl.to([letters, boldOverlay, signalLine, subtitle], {
        opacity: 0,
        duration: 0.12,
        ease: easeCine,
      }, '+=0.1')
        .to(exitEl, {
          opacity: 1,
          duration: 0.1,
          ease: 'none',
        }, '<+0.06');

    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotionActive]);

  return (
    <div ref={sectionRef} style={{ height: "420vh" }} className="relative">
      {/* Pinned viewport */}
      <div
        ref={pinRef}
        className="h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Chapter label */}
        <div className="absolute top-10 left-10 font-mono text-[9px] uppercase tracking-[0.35em] text-white/20 select-none">
          <span>01</span>
          <span className="mx-3 text-white/10">—</span>
          <span>Signal</span>
        </div>

        {/* Name SVG canvas */}
        <svg
          ref={svgRef}
          aria-label="Binore Mohapatra"
          role="img"
          className="w-full overflow-visible"
          style={{
            height: 'clamp(80px, 16vw, 200px)',
            // Horizontal padding matches --grid-margin (42px)
            paddingInline: 'var(--spacing-5, 42px)',
          }}
        >
          {/* Signal Line — FaultLine beneath the name */}
          <line
            ref={signalLineRef}
            x1="0" y1="100%"
            x2="100%" y2="100%"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Letter group — positioned via x offsets computed from font metrics */}
          <g>
            {NAME_CHARS.map((char, i) => {
              // Evenly space letters for the pre-measurement state
              // After mount, GSAP/getComputedTextLength will control the actual lengths
              const xPercent = (i / NAME_CHARS.length) * 100;

              return (
                <text
                  key={char + i}
                  ref={(el) => setLetterRef(el, i)}
                  x={`${xPercent}%`}
                  y="78%"
                  fontSize="clamp(72px, 15vw, 180px)"
                  fontFamily="var(--font-sans, Inter, sans-serif)"
                  fontWeight={i === WEIGHT_SEAM_INDEX ? "300" : "300"}
                  letterSpacing="-0.02em"
                  fill="white"
                  fillOpacity="0"
                  stroke="white"
                  strokeWidth="0.5"
                  paintOrder="stroke"
                  aria-hidden="true"
                >
                  {char}
                </text>
              );
            })}

            {/* Weight Seam bold overlay — "O" at display weight */}
            <text
              ref={boldOverlayRef}
              x={`${(WEIGHT_SEAM_INDEX / NAME_CHARS.length) * 100}%`}
              y="78%"
              fontSize="clamp(72px, 15vw, 180px)"
              fontFamily="var(--font-sans, Inter, sans-serif)"
              fontWeight="800"
              letterSpacing="-0.02em"
              fill="white"
              stroke="none"
              aria-hidden="true"
              style={{ clipPath: 'inset(0 100% 0 0)' }}
            >
              O
            </text>
          </g>
        </svg>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.45em] text-white/40"
          style={{ opacity: 0 }}
        >
          Full-Stack Engineer
        </div>

        {/* Decorative — bottom right corner meta */}
        <div className="absolute bottom-8 right-10 text-right font-mono text-[9px] text-white/15 select-none leading-relaxed">
          <div>Bridging systems</div>
          <div>with design</div>
        </div>
      </div>

      {/* Exit overlay */}
      <div
        ref={exitRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-background"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
