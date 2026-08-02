"use client";

/**
 * chapters/logic/Logic.tsx
 *
 * CHAPTER VI — "LOGIC"
 * Competence & Code: Frontend/Client stack.
 */

import { useRef } from "react";
import { VariableProximity } from "@/components/ui/VariableProximity";
import { Timeline } from "@/components/ui/Timeline";

const FRONTEND_STACK = [
  "React", "Next.js", "TypeScript", "TailwindCSS", "GSAP",
  "Three.js", "React Three Fiber", "Framer Motion", "Zustand",
  "React Query", "WebRTC", "WebGL", "Figma", "Storybook"
];

export function Logic() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background py-32 px-6 flex flex-col justify-center items-center overflow-hidden">
      <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/20 select-none mb-12">
        <span>06</span>
        <span className="mx-3 text-white/10">—</span>
        <span>Logic & Interfaces</span>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <h2 className="font-serif text-4xl md:text-6xl text-primary mb-8 leading-tight">
          Crafting 60fps cinematic experiences.
        </h2>

        <p className="text-muted-foreground/60 max-w-2xl mx-auto text-lg mb-24">
          Uncompromising performance meets award-winning motion design.
          Bridging the gap between creative vision and engineering execution.
        </p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-32">
          {FRONTEND_STACK.map((tech) => (
            <div key={tech} className="relative">
              <VariableProximity
                label={tech}
                containerRef={containerRef}
                radius={150}
                falloff="gaussian"
                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                toFontVariationSettings="'wght' 900, 'opsz' 40"
                className="font-sans text-2xl md:text-4xl text-primary/80 cursor-default tracking-tight transition-colors hover:text-primary"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <Timeline
          data={[
            {
              title: "2024",
              content: (
                <div>
                  <p className="text-neutral-400 text-sm md:text-base font-sans mb-4">
                    Architected robust distributed systems for enterprise clients, scaling Next.js & React Native architectures.
                  </p>
                </div>
              )
            },
            {
              title: "2022",
              content: (
                <div>
                  <p className="text-neutral-400 text-sm md:text-base font-sans mb-4">
                    Led frontend teams focusing on high-performance WebGL and GSAP driven interactions.
                  </p>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
