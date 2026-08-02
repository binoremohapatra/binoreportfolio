"use client";

/**
 * chapters/structure/Structure.tsx
 *
 * CHAPTER II — "STRUCTURE"
 * 12-column grid assembly and telemetry labels.
 */

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BlurText, SplitText } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Structure() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const lines = gridLinesRef.current.filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "+=100%",
          scrub: true,
        },
      });

      tl.fromTo(
        lines,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1, stagger: 0.05, ease: "power2.inOut" }
      );
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-background flex flex-col items-center justify-center py-32 overflow-hidden">
      {/* 12-column grid background */}
      <div className="absolute inset-0 grid-binore pointer-events-none opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="relative h-full w-full">
            <div
              ref={(el) => { gridLinesRef.current[i] = el; }}
              className="absolute left-0 w-px h-full bg-border"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl px-6">
        <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/20 mb-8">
          <span>02</span>
          <span className="mx-3 text-white/10">—</span>
          <span>Structure</span>
        </div>

        <h2 className="font-serif text-5xl md:text-7xl text-primary mb-12">
          <SplitText
            text="Precision in every pixel."
            delay={30}
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
          />
        </h2>

        <div className="text-muted-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed font-sans">
          <BlurText
            text="We build on a foundation of mathematics and proportion. The 12-column grid and Fibonacci sequence govern every spatial relationship, ensuring a layout that feels instinctively right."
            delay={20}
            animateBy="words"
          />
        </div>
      </div>
    </div>
  );
}
