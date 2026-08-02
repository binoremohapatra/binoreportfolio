"use client";

/**
 * components/chrome/GlobalChrome.tsx
 *
 * GLOBAL CHROME — The persistent shell that wraps every chapter.
 * Composes: SkipNav, StitchCursor, ChapterIndex, ProgressSpine.
 *
 * Phase 3: Now internally driven by:
 *   - useMasterScrollProgress → ProgressSpine (imperative GSAP update, no React re-renders)
 *   - useChapterInView → ChapterIndex (IntersectionObserver, React state update only on chapter change)
 *
 * No props needed from parent — GlobalChrome is fully self-contained.
 */

import { useRef, useCallback } from 'react';
import { SkipNav } from './SkipNav';
import { StitchCursor } from './StitchCursor';
import { ChapterIndex } from './ChapterIndex';
import { ProgressSpine } from './ProgressSpine';
import { useMasterScrollProgress } from '@/hooks/useMasterScrollProgress';
import { useChapterInView } from '@/hooks/useChapterInView';
import { gsap } from 'gsap';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { Dock, DockIcon } from '@/components/ui/dock';
import { Home, User, Briefcase, Mail } from 'lucide-react';

export function GlobalChrome() {
  const activeChapter = useChapterInView();

  const spineFilledRef = useRef<HTMLDivElement | null>(null);
  const spineDotRef = useRef<HTMLDivElement | null>(null);

  const onScrollProgress = useCallback((progress: number) => {
    if (spineFilledRef.current) {
      gsap.set(spineFilledRef.current, { scaleY: progress });
    }
    if (spineDotRef.current) {
      gsap.set(spineDotRef.current, { top: `${progress * 100}%` });
    }
  }, []);

  useMasterScrollProgress(onScrollProgress);

  return (
    <>
      <SkipNav />
      <StitchCursor />
      <ChapterIndex activeChapter={activeChapter} />
      <ProgressSpine
        filledRef={spineFilledRef}
        dotRef={spineDotRef}
      />
      <CommandPalette />

      {/* Bottom Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <Dock direction="middle">
          <DockIcon onClick={() => window.scrollTo(0, 0)}>
            <Home className="w-5 h-5" />
          </DockIcon>
          <DockIcon onClick={() => document.getElementById('the-work')?.scrollIntoView({ behavior: 'smooth' })}>
            <Briefcase className="w-5 h-5" />
          </DockIcon>
          <DockIcon onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            <Mail className="w-5 h-5" />
          </DockIcon>
        </Dock>
      </div>

      {/* Cmd+K Hint */}
      <div className="fixed top-6 right-8 z-50 text-xs font-mono text-muted-foreground/50 pointer-events-none hidden md:block">
        Press <kbd className="border border-border rounded px-1">Cmd</kbd> + <kbd className="border border-border rounded px-1">K</kbd>
      </div>
    </>
  );
}

