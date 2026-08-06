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

  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, { width: `${progress}%`, duration: 0.3, ease: 'power2.out' });
    }
  }, [progress]);

  useEffect(() => {
    if (!done || !rootRef.current) return;
    
    // Lock body scroll just in case
    document.body.style.overflow = 'hidden';
    
    gsap.timeline({ 
      onComplete: () => {
        document.body.style.overflow = '';
        onExitComplete();
      } 
    }).to(rootRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      delay: 0.25, // brief hold at 100% so it doesn't feel like a glitch-snap
    });
  }, [done, onExitComplete]);

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg-primary, #131416)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Technor, sans-serif',
          fontWeight: 700,
          fontSize: 48,
          color: 'var(--text-primary, #ffffff)',
        }}
      >
        {progress}%
      </div>
      <div
        style={{
          width: 240,
          height: 2,
          background: 'var(--bg-secondary, #261917)',
          marginTop: 16,
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{ width: '0%', height: '100%', background: 'var(--color-accent, #e0303d)' }}
        />
      </div>
    </div>
  );
}
