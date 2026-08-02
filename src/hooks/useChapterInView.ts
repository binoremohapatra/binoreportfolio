"use client";

/**
 * hooks/useChapterInView.ts
 *
 * Detects which chapter anchor is currently active using IntersectionObserver.
 * Drives the ChapterIndex highlight in GlobalChrome.
 *
 * ARCHITECTURE NOTE:
 * Uses a single shared IntersectionObserver for all chapter sections —
 * not one observer per section. This is the correct, memory-efficient pattern.
 *
 * Intersection threshold: 0.3 — a chapter is "active" when 30% of it is visible.
 * The topmost intersecting chapter wins (prevents mid-chapter false-reads).
 */

import { useEffect, useState, useRef } from "react";
import { CHAPTERS, type ChapterId } from "@/lib/constants";

export function useChapterInView(): ChapterId | undefined {
  const [activeChapter, setActiveChapter] = useState<ChapterId | undefined>(
    // Default to prologue (first chapter)
    CHAPTERS[0]?.id
  );
  // Track which sections are currently intersecting
  const intersectingRef = useRef<Map<ChapterId, number>>(new Map());

  useEffect(() => {
    const sections = CHAPTERS.map((ch) => ({
      id: ch.id,
      el: document.getElementById(ch.id),
    })).filter((s) => s.el !== null) as { id: ChapterId; el: HTMLElement }[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id as ChapterId;
          if (entry.isIntersecting) {
            // Store the top position of the intersecting element
            intersectingRef.current.set(id, entry.boundingClientRect.top);
          } else {
            intersectingRef.current.delete(id);
          }
        });

        // The active chapter is the one whose top is closest to 0 (top of viewport)
        // from the currently intersecting set — handles overlapping sections from pins
        let topmost: ChapterId | undefined;
        let topmostY = Infinity;

        intersectingRef.current.forEach((top, id) => {
          const absTop = Math.abs(top);
          if (absTop < topmostY) {
            topmostY = absTop;
            topmost = id;
          }
        });

        if (topmost) {
          setActiveChapter(topmost);
        }
      },
      {
        // 30% visible triggers — balances early detection vs false-reads
        threshold: [0.1, 0.3, 0.5],
        // Negative top margin shrinks detection zone to center of viewport
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    sections.forEach(({ el }) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return activeChapter;
}
