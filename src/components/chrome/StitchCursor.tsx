"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function StitchCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    document.documentElement.style.cursor = 'none';

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Use GSAP quickTo for highly performant, state-free cursor tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToDot(e.clientX);
      yToDot(e.clientY);
    };

    const onEnterInteractive = () => {
      gsap.to(cursor, { scale: 2, opacity: 0.6, duration: 0.3, ease: 'power2.out' });
      gsap.to(cursor.querySelector('svg'), { rotate: 45, duration: 0.3, ease: 'power2.out' });
    };
    
    const onLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(cursor.querySelector('svg'), { rotate: 0, duration: 0.3, ease: 'power2.out' });
    };

    const onMouseDown = () => {
      gsap.to([cursor, dot], { scale: 0.8, duration: 0.15, ease: 'power3.out' });
    };
    const onMouseUp = () => {
      gsap.to([cursor, dot], { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    // MutationObserver to attach to dynamically rendered interactive elements
    const attachListeners = () => {
      const interactiveEls = document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], [data-cursor-hover], input, textarea'
      );
      interactiveEls.forEach((el) => {
        // Prevent adding multiple listeners
        if (el.dataset.cursorAttached) return;
        el.dataset.cursorAttached = "true";
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    };

    attachListeners();
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <line x1="16" y1="4"  x2="16" y2="10" stroke="white" strokeWidth="1.5" />
          <line x1="16" y1="22" x2="16" y2="28" stroke="white" strokeWidth="1.5" />
          <line x1="4"  y1="16" x2="10" y2="16" stroke="white" strokeWidth="1.5" />
          <line x1="22" y1="16" x2="28" y2="16" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>
    </>
  );
}
