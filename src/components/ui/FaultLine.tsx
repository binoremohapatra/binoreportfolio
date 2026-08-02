"use client";

/**
 * components/ui/FaultLine.tsx
 *
 * THE FAULT LINE — A precise, single-jog horizontal/vertical divider.
 * The site's dividing-line and connecting-line motif.
 *
 * Rules (from Part 8):
 * ✓ MUST appear on: Signal Line, section dividers, Progress Spine, Ch.V connector lines.
 * ✓ SHOULD appear on: underlines on hover states.
 * ✗ MUST NEVER have more than one jog per line.
 * ✗ MUST NEVER be used as a purely decorative flourish unconnected to dividing/connecting.
 *
 * The jog is the defining characteristic — the line travels, then offsets by a
 * precise amount (default: --spacing-2 = 10px), then continues.
 * The jog position along the line is controlled by `jogAt` (0–1, default 0.62 = split-ratio).
 */

import { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface FaultLineProps {
  /** Orientation of the line */
  direction?: 'horizontal' | 'vertical';
  /** Jog offset in px — defaults to 10 (--spacing-2) */
  jogSize?: number;
  /** Position along the line where the jog occurs — 0 to 1. Default 0.62 (split ratio) */
  jogAt?: number;
  /** Additional class names on the SVG wrapper */
  className?: string;
  style?: CSSProperties;
  /** Stroke color — defaults to var(--border) */
  color?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Animate the line drawing in on mount */
  animated?: boolean;
}

export function FaultLine({
  direction = 'horizontal',
  jogSize = 10,
  jogAt = 0.62,
  className,
  style,
  color = 'var(--border)',
  strokeWidth = 1,
}: FaultLineProps) {
  const isHorizontal = direction === 'horizontal';

  // Build SVG path for a jogged line.
  // For horizontal: travels right, jogs up by jogSize, continues right.
  // viewBox is 100×(jogSize + strokeWidth) for horizontal, (jogSize+sw)×100 for vertical.
  const vbW = isHorizontal ? 100 : jogSize + strokeWidth * 2;
  const vbH = isHorizontal ? jogSize + strokeWidth * 2 : 100;

  const mid = jogAt * 100;
  const halfSW = strokeWidth / 2;

  const d = isHorizontal
    ? `M 0 ${vbH / 2 + jogSize / 2} L ${mid} ${vbH / 2 + jogSize / 2} L ${mid} ${vbH / 2 - jogSize / 2} L 100 ${vbH / 2 - jogSize / 2}`
    : `M ${vbW / 2 + jogSize / 2} 0 L ${vbW / 2 + jogSize / 2} ${mid} L ${vbW / 2 - jogSize / 2} ${mid} L ${vbW / 2 - jogSize / 2} 100`;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        isHorizontal ? 'w-full' : 'h-full',
        className
      )}
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio={isHorizontal ? 'none' : 'none'}
      style={style}
      overflow="visible"
    >
      <path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
