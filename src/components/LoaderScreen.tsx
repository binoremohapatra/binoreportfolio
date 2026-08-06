'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function LoaderScreen({
  progress,
  done,
  onExitComplete,
}: {
  progress: number;
  done: boolean;
  onExitComplete: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, { width: `${progress}%`, duration: 0.3, ease: 'power2.out' });
    }
  }, [progress]);

  useEffect(() => {
    if (!done || !rootRef.current || !topHalfRef.current || !bottomHalfRef.current || !contentRef.current) return;
    
    // Lock body scroll during the epic transition
    document.body.style.overflow = 'hidden';
    
    const tl = gsap.timeline({ 
      onComplete: () => {
        document.body.style.overflow = '';
        onExitComplete();
      } 
    });

    // 1. Scale up the content and fade it out with a blur effect
    tl.to(contentRef.current, {
      scale: 1.1,
      opacity: 0,
      filter: 'blur(12px)',
      duration: 0.6,
      ease: 'power3.inOut',
      delay: 0.2, // Small hold at 100% to let it register
    });

    // 2. Split the background vertically like cinematic sci-fi doors opening
    tl.to(
      [topHalfRef.current, bottomHalfRef.current],
      {
        yPercent: (i) => (i === 0 ? -100 : 100),
        duration: 1.2,
        ease: 'expo.inOut',
      },
      '-=0.2' // Start slightly before the content completely vanishes
    );

  }, [done, onExitComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center origin-center"
    >
      {/* ── Cinematic Split Background ── */}
      <div ref={topHalfRef} className="absolute top-0 left-0 w-full h-1/2 bg-[#131416] pointer-events-auto origin-top border-b border-white/5" />
      <div ref={bottomHalfRef} className="absolute bottom-0 left-0 w-full h-1/2 bg-[#131416] pointer-events-auto origin-bottom border-t border-white/5" />

      {/* ── Loader Content ── */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 pointer-events-auto">
        
        {/* Animated Typography */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div 
            className="text-[#e0303d] font-mono text-[10px] sm:text-xs tracking-[0.4em] uppercase font-bold animate-pulse" 
            style={{ textShadow: '0 0 12px rgba(224,48,61,0.6)' }}
          >
            LOADING...
          </div>
          
          <div className="flex items-end gap-1">
            <div
              className="font-bold text-white tabular-nums tracking-tighter"
              style={{ fontFamily: 'Technor, sans-serif', fontSize: 'clamp(56px, 12vw, 96px)', lineHeight: 0.85 }}
            >
              {Math.round(progress)}
            </div>
            <div className="text-white/30 font-bold mb-1 sm:mb-2 text-2xl sm:text-4xl" style={{ fontFamily: 'Technor, sans-serif' }}>
              %
            </div>
          </div>
        </div>

        {/* Premium Progress Bar */}
        <div className="relative w-[280px] sm:w-[400px] h-[3px] bg-white/5 rounded-full overflow-hidden shadow-inner">
          <div
            ref={barRef}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#9c2b2b] to-[#e0303d] rounded-full"
            style={{ 
              width: '0%',
              boxShadow: '0 0 20px 2px rgba(224,48,61,0.4)'
            }}
          >
            {/* Glowing tip */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[20%] h-full bg-white/80 blur-[2px]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-[200%] bg-white rounded-full shadow-[0_0_10px_white]" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#e0303d]/5 blur-[80px] -z-10 rounded-full" />
      </div>
    </div>
  );
}
