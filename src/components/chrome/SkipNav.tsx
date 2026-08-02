"use client";

/**
 * components/chrome/SkipNav.tsx
 *
 * Skip Navigation — accessibility requirement per Part 6.
 * Allows keyboard users to bypass the cinematic intro and jump directly
 * to real content on first Tab press.
 *
 * Visually hidden until focused (standard skip-nav pattern).
 * Target: #main-content
 */

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className={[
        // Visually hidden at rest
        'fixed top-0 left-0 z-[9999]',
        'px-4 py-2 bg-background text-foreground font-mono text-sm uppercase tracking-widest',
        'border border-border',
        // Visible on focus
        'translate-y-[-100%] focus:translate-y-0',
        'transition-transform duration-200',
        // Custom focus ring per Design Language (never remove outline without replacement)
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
      ].join(' ')}
    >
      Skip to content
    </a>
  );
}
