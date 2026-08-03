'use client';

/**
 * LogoLoop — Infinite horizontal logo marquee
 *
 * Props:
 *   logos        — Array of { node: ReactNode, title: string, href?: string }
 *   speed        — Duration in seconds for one full cycle (default 30)
 *   direction    — 'left' | 'right' (default 'left')
 *   logoHeight   — Height of each icon in px (default 40)
 *   gap          — Gap between items in px (default 56)
 *   fadeOut      — Whether to show edge fade-out masks (default true)
 *   fadeOutColor — CSS color for the edge fade (must match bg, default '#ffffff')
 *   showLabels   — Whether to show the title label under each icon (default true)
 *   ariaLabel    — Accessible label for the marquee region
 */

import React from 'react';
import './LogoLoop.css';

interface LogoItem {
  node: React.ReactNode;
  title: string;
  href?: string;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  logoHeight?: number;
  gap?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  showLabels?: boolean;
  ariaLabel?: string;
}

export default function LogoLoop({
  logos,
  speed = 30,
  direction = 'left',
  logoHeight = 40,
  gap = 56,
  fadeOut = true,
  fadeOutColor = '#ffffff',
  showLabels = true,
  ariaLabel = 'Logo marquee',
}: LogoLoopProps) {
  // 4 copies ensures the strip is always wider than any screen size
  // CSS animation translates by -50% = exactly 2 sets, creating a seamless loop
  const items = [...logos, ...logos, ...logos, ...logos];

  return (
    <div
      className="logoloop"
      role="region"
      aria-label={ariaLabel}
      style={{
        // CSS custom property used by ::before / ::after masks
        ['--logoloop-fade-color' as string]: fadeOut ? fadeOutColor : 'transparent',
        ['--logoloop-duration' as string]: `${speed}s`,
      }}
    >
      <div
        className={`logoloop__track logoloop__track--${direction}`}
        style={{ gap: `${gap}px`, padding: `8px ${gap / 2}px` }}
        aria-hidden="true" // decorative marquee
      >
        {items.map((logo, i) => {
          const inner = (
            <>
              <span
                style={{
                  fontSize: `${logoHeight}px`,
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                {logo.node}
              </span>
              {showLabels && <span>{logo.title}</span>}
            </>
          );

          return (
            <div key={i} className="logoloop__item">
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={logo.title}
                  tabIndex={-1} // decorative, outside marquee accessible label
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
