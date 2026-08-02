"use client";

/**
 * components/chrome/ChapterIndex.tsx
 *
 * CHAPTER INDEX — The persistent vertical chapter navigation on the left edge.
 * Displays numbered chapter anchors. The active chapter is indicated by an
 * underlit label that uses the FaultLine hover state rule.
 *
 * Chapters are defined in lib/constants.ts — the single source of truth.
 * Each anchor is a real `<a href="#id">` for SEO/sharability (Part 2).
 */

import { useCallback } from 'react';
import { CHAPTERS, type ChapterId } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ChapterIndexProps {
  activeChapter?: ChapterId;
}

export function ChapterIndex({ activeChapter }: ChapterIndexProps) {
  // Smooth-scroll to anchor (Lenis handles the actual smooth-scroll)
  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
      e.preventDefault();
      const el = document.querySelector(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Update URL without triggering navigation
        window.history.pushState(null, '', anchor);
      }
    },
    []
  );

  return (
    <nav
      aria-label="Chapter navigation"
      className="fixed left-6 top-0 h-full z-50 flex flex-col items-start justify-center pointer-events-none"
      style={{ paddingBlock: 'var(--spacing-6, 68px)' }}
    >
      <ol className="flex flex-col gap-4">
        {CHAPTERS.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          return (
            <li key={chapter.id}>
              <a
                href={chapter.anchor}
                onClick={(e) => handleAnchorClick(e, chapter.anchor)}
                aria-label={`Go to chapter ${chapter.label}: ${chapter.name}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'pointer-events-auto group flex items-center gap-2',
                  'font-mono text-[10px] uppercase tracking-[0.2em]',
                  'transition-colors duration-300',
                  isActive ? 'text-primary' : 'text-border hover:text-muted-foreground',
                  // Custom focus ring — never remove outline without replacement
                  'focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm'
                )}
              >
                {/* Chapter number */}
                <span className="tabular-nums">{chapter.label}</span>
                {/* FaultLine hover underline — appears only on hover/active */}
                <span
                  className={cn(
                    'block h-px flex-1 min-w-[16px] origin-left transition-all duration-500',
                    isActive ? 'bg-primary scale-x-100' : 'bg-border scale-x-0 group-hover:scale-x-100 group-hover:bg-muted-foreground'
                  )}
                  aria-hidden="true"
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
