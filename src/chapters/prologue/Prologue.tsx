"use client";

/**
 * chapters/prologue/Prologue.tsx
 *
 * THE PROLOGUE — Signal Point ignition sequence.
 *
 * Visual spec:
 * - Full black screen
 * - A single 4px dot at the exact centre (the Signal Point)
 * - On scroll: dot pulses → cross-arms extend → retract → dot explodes
 * - The explosion is the transition into Chapter I Signal
 *
 * Motion governed by prologueTimeline.ts.
 * The entire section is pinned via GSAP ScrollTrigger (anticipatePin: 1).
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { easeSignal, easeCine } from "@/animations/easings";

export function Prologue() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const pointRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const armTopRef = useRef<SVGLineElement>(null);
  const armRightRef = useRef<SVGLineElement>(null);
  const armBottomRef = useRef<SVGLineElement>(null);
  const armLeftRef = useRef<SVGLineElement>(null);
  const exitRef = useRef<HTMLDivElement>(null);

  const { isReducedMotionActive } = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const pin = pinRef.current!;
      const point = pointRef.current!;
      const ring1 = ring1Ref.current!;
      const ring2 = ring2Ref.current!;
      const armTop = armTopRef.current!;
      const armRight = armRightRef.current!;
      const armBottom = armBottomRef.current!;
      const armLeft = armLeftRef.current!;
      const exitEl = exitRef.current!;

      // ── Reduced motion: skip all animation, just show static state ──────
      if (isReducedMotionActive) {
        gsap.set([point, ring1, ring2], { opacity: 1, scale: 1 });
        return;
      }

      // ── Initial states ────────────────────────────────────────────────
      gsap.set(point, { scale: 0, opacity: 0 });
      gsap.set([ring1, ring2], { scale: 0, opacity: 0 });
      gsap.set(exitEl, { opacity: 0 });

      // Set arm start states (all pointing to center)
      gsap.set(armTop, { attr: { x1: '50%', y1: '50%', x2: '50%', y2: '50%', opacity: 0 } });
      gsap.set(armBottom, { attr: { x1: '50%', y1: '50%', x2: '50%', y2: '50%', opacity: 0 } });
      gsap.set(armLeft, { attr: { x1: '50%', y1: '50%', x2: '50%', y2: '50%', opacity: 0 } });
      gsap.set(armRight, { attr: { x1: '50%', y1: '50%', x2: '50%', y2: '50%', opacity: 0 } });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // ── Signal Point arrives (Handshake) ───────────────────────────────
      tl.to(point, {
        scale: 1, opacity: 1, duration: 0.08, ease: easeSignal,
      });

      // ── Pulse: two rings expand and dissolve ──────────────────────────
      tl.to(ring1, {
        scale: 5, opacity: 0, duration: 0.12, ease: easeCine,
      }, '<+0.02')
        .to(ring2, {
          scale: 8, opacity: 0, duration: 0.18, ease: easeCine,
        }, '<+0.05');

      // ── Cross-arms extend from centre ─────────────────────────────────
      tl.to([armTop, armBottom, armLeft, armRight], {
        attr: { opacity: 1 }, duration: 0.02, ease: 'none',
      }, '<+0.05')
        .to(armTop, {
          attr: { y2: '0%' }, duration: 0.28, ease: easeSignal,
        }, '<')
        .to(armBottom, {
          attr: { y2: '100%' }, duration: 0.28, ease: easeSignal,
        }, '<+0.03')
        .to(armLeft, {
          attr: { x2: '0%' }, duration: 0.28, ease: easeSignal,
        }, '<-0.02')
        .to(armRight, {
          attr: { x2: '100%' }, duration: 0.28, ease: easeSignal,
        }, '<+0.02');

      // ── Point intensifies ─────────────────────────────────────────────
      tl.to(point, {
        scale: 2,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.5), 0 0 24px rgba(255,255,255,0.12)',
        duration: 0.2, ease: easeSignal,
      }, '>');

      // ── Arms retract (FaultLine retract) ──────────────────────────────
      tl.to(armTop, { attr: { y2: '50%' }, duration: 0.2, ease: easeCine }, '<')
        .to(armBottom, { attr: { y2: '50%' }, duration: 0.2, ease: easeCine }, '<+0.02')
        .to(armLeft, { attr: { x2: '50%' }, duration: 0.2, ease: easeCine }, '<')
        .to(armRight, { attr: { x2: '50%' }, duration: 0.2, ease: easeCine }, '<+0.02')
        .to([armTop, armBottom, armLeft, armRight], {
          attr: { opacity: 0 }, duration: 0.1, ease: easeCine,
        }, '<+0.1');

      // ── Explosion → exit ───────────────────────────────────────────────
      tl.to(point, {
        scale: 40, opacity: 0, duration: 0.28, ease: 'power3.in',
      }, '>')
        .to(exitEl, {
          opacity: 1, duration: 0.15, ease: 'none',
        }, '<+0.18');

    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotionActive]);

  return (
    <div ref={sectionRef} style={{ height: "350vh" }} className="relative">
      {/* Pinned viewport */}
      <div
        ref={pinRef}
        className="h-screen w-full bg-background flex items-center justify-center overflow-hidden"
      >
        {/* Cross-arm SVG layer */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Vertical arm — top */}
          <line
            ref={armTopRef}
            x1="50%" y1="50%" x2="50%" y2="50%"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Vertical arm — bottom */}
          <line
            ref={armBottomRef}
            x1="50%" y1="50%" x2="50%" y2="50%"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Horizontal arm — left */}
          <line
            ref={armLeftRef}
            x1="50%" y1="50%" x2="50%" y2="50%"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Horizontal arm — right */}
          <line
            ref={armRightRef}
            x1="50%" y1="50%" x2="50%" y2="50%"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Pulse rings */}
        <div
          ref={ring1Ref}
          aria-hidden="true"
          className="absolute w-2 h-2 rounded-full border border-white/30 pointer-events-none"
          style={{ opacity: 0 }}
        />
        <div
          ref={ring2Ref}
          aria-hidden="true"
          className="absolute w-2 h-2 rounded-full border border-white/15 pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Title Text — fades out on scroll */}
        <div
          ref={(el) => {
            if (el) {
              gsap.to(el, {
                opacity: 0,
                y: -50,
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top top",
                  end: "+=50%",
                  scrub: 1,
                }
              });
            }
          }}
          className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none"
        >
          <h1 className="font-serif text-5xl md:text-8xl text-primary/80 tracking-tight mb-4">
            Binore Mohapatra
          </h1>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
            Creative Full-Stack Engineer
          </div>
        </div>

        {/* Signal Point — the core */}
        <div
          ref={pointRef}
          aria-hidden="true"
          className="relative z-10 w-[5px] h-[5px] rounded-full bg-white"
          style={{ transform: 'scale(0)', opacity: 0 }}
        />

        {/* Chapter label — bottom left */}
        <div className="absolute bottom-8 left-10 font-mono text-[9px] uppercase tracking-[0.35em] text-white/20 select-none">
          <span>00</span>
          <span className="mx-3 text-white/10">—</span>
          <span>Prologue</span>
        </div>

        {/* Scroll hint — fades as user scrolls */}
        <div className="absolute bottom-8 right-10 font-mono text-[9px] uppercase tracking-[0.25em] text-white/20 animate-pulse select-none">
          Scroll
        </div>
      </div>

      {/* Exit overlay — black fade-out as Prologue ends */}
      <div
        ref={exitRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-background"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
