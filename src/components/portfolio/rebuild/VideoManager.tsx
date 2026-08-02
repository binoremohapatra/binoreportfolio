'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

interface Section {
  id: string;
  videoSrc: string;
}

interface VideoManagerProps {
  sections: Section[];
  activeSection: string;
  onSectionActive?: (id: string) => void;
  isReducedMotion: boolean;
}

export default function VideoManager({ sections, activeSection, onSectionActive, isReducedMotion }: VideoManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Get all section elements from the DOM
    const sectionEls = document.querySelectorAll('.portfolio-section');

    sections.forEach((section, index) => {
      const sectionEl = sectionEls[index];
      const video = videoRefs.current[index];
      const videoContainer = containerRef.current!.children[index] as HTMLElement;

      if (!sectionEl || !video) return;

      // Ensure video is paused. We drive the frame manually.
      video.pause();

      ScrollTrigger.create({
        trigger: sectionEl,
        // The scroll range: from when section top reaches viewport top, to when it fully scrolls past
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onToggle: (self) => {
          if (self.isActive && onSectionActive) {
            onSectionActive(section.id);
          }
        },
        onUpdate: (self) => {
          // Update the opacity of the video container based on its active state
          // (We use a simple threshold here: if progress > 0 and < 1 it is in range)
          // Wait, GSAP also handles opacity crossfade in the same scroll range? 
          // It's cleaner to let React handle the overall opacity based on activeSection, 
          // or we can animate opacity here.
          // Since the prompt says "Keep the existing content fade-in/nav-rail-active logic exactly as is", 
          // we'll handle opacity via React effect (like before) or a separate GSAP animation tied to activeSection.

          // Video Scrubbing Logic
          if (video.readyState >= 1) { // HAVE_METADATA = 1
            const duration = video.duration;
            if (isReducedMotion) {
              const targetTime = self.progress > 0.5 ? duration : 0;
              if (Math.abs(video.currentTime - targetTime) > 0.03) {
                video.currentTime = targetTime;
              }
            } else {
              const targetTime = duration * self.progress;
              // Skip redundant seeks to avoid flickering in some browsers
              if (Math.abs(video.currentTime - targetTime) > 0.03) {
                video.currentTime = targetTime;
              }
            }
          }
        }
      });
    });

  }, { scope: containerRef, dependencies: [isReducedMotion, onSectionActive] });

  // Handle Opacity crossfades (kept exactly as it was, responding to activeSection)
  useGSAP(() => {
    if (!containerRef.current || isReducedMotion) return;

    sections.forEach((section, index) => {
      const videoContainer = containerRef.current!.children[index] as HTMLElement;
      gsap.to(videoContainer, {
        opacity: section.id === activeSection ? 0.6 : 0,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    });
  }, { scope: containerRef, dependencies: [activeSection, isReducedMotion] });

  useEffect(() => {
    if (!isReducedMotion || !containerRef.current) return;

    sections.forEach((section, index) => {
      const videoContainer = containerRef.current!.children[index] as HTMLElement;
      videoContainer.style.opacity = section.id === activeSection ? '0.6' : '0';
      videoContainer.style.transition = 'none';
    });
  }, [activeSection, isReducedMotion]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 bg-graphite w-full h-full pointer-events-none">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: index === 0 ? 0.6 : 0 }}
        >
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            src={section.videoSrc}
            muted
            playsInline
            preload={index === 0 ? "auto" : "metadata"}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-graphite/40" />
        </div>
      ))}
    </div>
  );
}
