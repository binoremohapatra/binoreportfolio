"use client";

/**
 * components/ui/SplitFrame.tsx
 *
 * THE SPLIT FRAME — The 62% / 4px / 38% image-framing motif.
 * Divides a visual/media container into two unequal panes separated by a gap seam.
 *
 * Rules (from Part 8):
 * ✓ MUST appear on: Ch.III project windows, Ch.IV hero images, modals.
 * ✓ SHOULD appear on: Ch.VI gauge panels.
 * ✗ MUST NEVER appear on body-text containers or purely typographic blocks.
 *
 * The --split-ratio (62%) and --gap-seam (4px) values come from tokens.css.
 */

import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface SplitFrameProps {
  /** Content for the larger (62%) primary pane */
  primary: ReactNode;
  /** Content for the smaller (38%) secondary pane */
  secondary: ReactNode;
  /** Orientation of the split */
  direction?: 'horizontal' | 'vertical';
  /** Additional class names on the wrapper */
  className?: string;
  style?: CSSProperties;
}

export function SplitFrame({
  primary,
  secondary,
  direction = 'horizontal',
  className,
  style,
}: SplitFrameProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={cn('relative flex overflow-hidden', isHorizontal ? 'flex-row' : 'flex-col', className)}
      style={style}
    >
      {/* Primary pane — 62% */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{
          [isHorizontal ? 'width' : 'height']: 'var(--split-ratio, 62%)',
        }}
      >
        {primary}
      </div>

      {/* The Seam — 4px gap */}
      <div
        aria-hidden="true"
        className="flex-shrink-0 bg-background"
        style={{
          [isHorizontal ? 'width' : 'height']: 'var(--gap-seam, 4px)',
        }}
      />

      {/* Secondary pane — 38% */}
      <div className="relative overflow-hidden flex-1">
        {secondary}
      </div>
    </div>
  );
}
