"use client";

/**
 * chapters/aperture/Aperture.tsx
 *
 * CHAPTER III — "APERTURE"
 * Horizontal WindowShelf showcasing projects via the ProjectWindow card.
 * Uses CircularText as a decorative element.
 */

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ProjectWindow } from "@/features/project-window/ProjectWindow";
import { PROJECTS } from "@/lib/projects";
import { CircularText } from "@/components/ui/CircularText";
import { ObserverSlider } from "@/components/ui/observer-slider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Aperture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const scrollContainer = scrollContainerRef.current;
      if (!section || !scrollContainer) return;

      const getScrollAmount = () => {
        const containerWidth = scrollContainer.scrollWidth;
        return -(containerWidth - window.innerWidth);
      };

      const tween = gsap.to(scrollContainer, {
        x: getScrollAmount,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
      });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="relative h-screen bg-background overflow-hidden flex flex-col justify-center">
      <div className="absolute top-10 left-10 font-mono text-[9px] uppercase tracking-[0.35em] text-white/20 select-none z-10">
        <span>03</span>
        <span className="mx-3 text-white/10">—</span>
        <span>Aperture</span>
      </div>

      {/* Decorative Circular Text */}
      <div className="absolute top-20 right-20 z-0 opacity-20 pointer-events-none">
        <CircularText text="FEATURED*PROJECTS*SHOWCASE*" size={120} fontSize={9} spinDuration={15} />
      </div>

      <div ref={scrollContainerRef} className="flex gap-8 px-10 w-max items-center h-full relative z-10">
        {PROJECTS.map((project, index) => (
          <div key={project.id} className="w-[85vw] md:w-[60vw] max-w-[800px] shrink-0">
            <ProjectWindow project={project} expanded={false} />
          </div>
        ))}
      </div>

      <div className="w-full relative z-20" style={{ height: "100vh" }}>
        <ObserverSlider
          slides={PROJECTS.map(p => ({
            id: p.id,
            title: p.name,
            imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" // Temporary placeholder
          }))}
        />
      </div>
    </div>
  );
}
