"use client";
// ScrollReveal – React Bits (GSAP + ScrollTrigger)
import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children?: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  customTriggerRef?: React.RefObject<HTMLElement | null>;
  customStart?: string;
  customEnd?: string;
}

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  customTriggerRef,
  customStart,
  customEnd,
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return <span className="word" key={index}>{word}</span>;
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const triggerEl = customTriggerRef && customTriggerRef.current ? customTriggerRef.current : el;
    const startPos = customStart || "top bottom";
    const endRot = customEnd || rotationEnd;
    const endWord = customEnd || wordAnimationEnd;

    gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: { trigger: triggerEl, scroller, start: startPos, end: endRot, scrub: true },
      }
    );

    const wordElements = el.querySelectorAll(".word");

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: "opacity" },
      {
        ease: "none",
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: { trigger: triggerEl, scroller, start: customStart || "top bottom-=20%", end: endWord, scrub: true },
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: "none",
          filter: "blur(0px)",
          stagger: 0.05,
          scrollTrigger: { trigger: triggerEl, scroller, start: customStart || "top bottom-=20%", end: endWord, scrub: true },
        }
      );
    }

    return () => { ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;