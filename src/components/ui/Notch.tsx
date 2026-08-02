"use client";

/**
 * components/ui/Notch.tsx
 *
 * THE NOTCH — The portfolio's primary structural motif.
 * A precise rectangular cut at the top-right corner of any elevated surface.
 *
 * Rules (from Part 8 — Protecting the Design Language):
 * ✓ MUST appear on every framed card, project window, button, modal.
 * ✗ MUST NEVER appear on more than one corner of the same element.
 * ✗ MUST NEVER be rotated to a corner other than top-right.
 *
 * Implementation: Uses a CSS clip-path polygon to cut the corner.
 * The notch size follows the Fibonacci Seam Rhythm: default is --spacing-3 (16px).
 */

import React, { CSSProperties, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface NotchProps {
  /** Contents wrapped by the notched container */
  children?: ReactNode;
  /** Notch size in px — defaults to 16 (--spacing-3). Only use Fibonacci values. */
  size?: 6 | 10 | 16 | 26 | 42;
  /** Additional class names applied to the outer container */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Render as a different HTML element */
  as?: React.ElementType;
}

export const Notch = forwardRef<HTMLDivElement, NotchProps>(
  ({ children, size = 16, className, style, as: Tag = 'div', ...rest }, ref) => {
    // Build the clip-path: full rect minus a triangle at top-right
    // Points: TL → (notch from TR) → TR-notch-down → BR → BL → close
    const clipPath = `polygon(
      0 0,
      calc(100% - ${size}px) 0,
      100% ${size}px,
      100% 100%,
      0 100%
    )`;

    const Component = Tag as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn('relative', className)}
        style={{ clipPath, ...style }}
        {...rest}
      >
        {children}
        {/* Visible corner indicator — a thin L-shaped line tracing the cut */}
        <NotchIndicator size={size} />
      </Component>
    );
  }
);

Notch.displayName = 'Notch';

// ─── Sub-component: The visible corner lines ──────────────────────────────────

function NotchIndicator({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      style={{ zIndex: 1 }}
    >
      {/* Horizontal arm of the notch corner */}
      <line
        x1={`calc(100% - ${size}px)`}
        y1="0"
        x2="100%"
        y2={`${size}px`}
        stroke="var(--border)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
