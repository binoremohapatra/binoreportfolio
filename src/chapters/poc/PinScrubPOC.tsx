"use client";

/**
 * chapters/poc/PinScrubPOC.tsx
 *
 * THROWAWAY PIN/SCRUB PROOF-OF-CONCEPT (Phase 3 requirement)
 *
 * From the Master Plan: "Do not proceed to Phase 4 until this phase has a
 * working, tested proof-of-concept chapter (a throwaway test section)
 * validating pin/scrub/unpin behavior cleanly."
 *
 * Tests:
 * 1. Pin + scrub: element pinned for a scrollable distance, content scrubs
 * 2. Unpin: element correctly unpins and scroll continues normally
 * 3. No competing ScrollTriggers: only one trigger registered (verified via ST.getAll())
 * 4. Cleanup: trigger killed on unmount (verified via useEffect return)
 * 5. Lenis compatibility: smooth scroll works during and after the pin
 *
 * This component is REMOVED in Phase 4 and replaced by the real Prologue chapter.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PinScrubPOC() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",        // Pinned for 3x viewport heights
          pin: pinContentRef.current,
          scrub: 1,             // 1s smoothing — the correct value for cinematic scrub
          anticipatePin: 1,     // Eliminates the jump-on-pin flash
          // Debug marker (remove in Phase 4):
          markers: process.env.NODE_ENV === "development"
            ? { startColor: "#ffffff", endColor: "#888888", fontSize: "10px" }
            : false,
          onUpdate: (self) => {
            // Validates that Lenis and ScrollTrigger are in sync
            // If progress jumps or stutters here, there's a RAF conflict
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { scaleX: self.progress });
            }
          },
        },
      });

      // Test animation 1: Character reveal via clip-path (proto-Ch.I pattern)
      tl.fromTo(
        ".poc-char",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, stagger: 0.05, ease: "power4.out" }
      );

      // Test animation 2: Horizontal panel separation (proto-Component Splitting)
      tl.fromTo(
        ".poc-panel-left",
        { x: 0 },
        { x: "-15%", ease: "power2.inOut" },
        "<"
      ).fromTo(
        ".poc-panel-right",
        { x: 0 },
        { x: "15%", ease: "power2.inOut" },
        "<"
      );

      // Test animation 3: Text opacity scrub
      tl.to(textRef.current, { opacity: 0.2, ease: "none" }, ">-0.3");

    }, sectionRef);

    // CRITICAL: Kill all triggers on unmount — verified as required by Master Plan
    return () => {
      ctx.revert();
      // Log remaining triggers in dev to confirm clean teardown
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[POC] ScrollTriggers after cleanup:",
          ScrollTrigger.getAll().length,
          "(should be 0 from this component)"
        );
      }
    };
  }, []);

  const chars = "SIGNAL".split("");

  return (
    <div ref={sectionRef} className="relative" style={{ height: "400vh" }}>
      {/* Pinned content container */}
      <div
        ref={pinContentRef}
        className="h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden"
      >
        {/* Progress indicator — validates scrub is smooth */}
        <div className="absolute top-0 left-0 right-0 h-px bg-border/30">
          <div
            ref={progressBarRef}
            className="absolute inset-0 bg-primary origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Split panels (tests Component Splitting proto-pattern) */}
        <div className="poc-panel-left absolute inset-y-0 left-0 w-1/2 border-r border-border/10" />
        <div className="poc-panel-right absolute inset-y-0 right-0 w-1/2" />

        {/* Character reveal test */}
        <div className="relative z-10 overflow-hidden flex gap-1 mb-8">
          {chars.map((char, i) => (
            <span
              key={i}
              className="poc-char inline-block font-mono text-[clamp(3rem,10vw,8rem)] tracking-[0.3em] text-primary"
              style={{ transform: "translateY(100%)", opacity: 0 }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Scrub test text */}
        <p
          ref={textRef}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          Pin · Scrub · Unpin — Motion Engine Validation
        </p>

        {/* DEV label */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-6 left-6 font-mono text-[8px] uppercase tracking-widest text-border/50">
            POC: Removed in Phase 4
          </div>
        )}
      </div>
    </div>
  );
}
