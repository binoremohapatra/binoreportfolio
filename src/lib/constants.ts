/**
 * lib/constants.ts
 * Design tokens as typed exports — single source of truth for JS/TS consumers.
 * CSS custom properties in styles/tokens.css remain the CSS source of truth.
 * These must stay in sync with tokens.css.
 */

// ─── Fibonacci Seam Rhythm ────────────────────────────────────────────────────
export const SPACING = {
  1: 6,   // --spacing-1
  2: 10,  // --spacing-2
  3: 16,  // --spacing-3
  4: 26,  // --spacing-4
  5: 42,  // --spacing-5
  6: 68,  // --spacing-6
  7: 110, // --spacing-7
  8: 178, // --spacing-8
} as const;

// ─── Structural Constants ─────────────────────────────────────────────────────
export const SPLIT_RATIO = 0.62;      // --split-ratio: 62%
export const GAP_SEAM = 4;            // --gap-seam: 4px
export const ANGLE_CUT = 15;          // --angle-cut: 15deg

// ─── Apex Noir Color Palette ──────────────────────────────────────────────────
export const COLORS = {
  background: '#050505',
  foreground: '#F5F5F5',
  primary: '#FFFFFF',
  border: '#222222',
  muted: '#111111',
  mutedForeground: '#888888',
  graphite: '#1A1A1A',
} as const;

// ─── Chapter Anchors ──────────────────────────────────────────────────────────
export const CHAPTERS = [
  { id: 'prologue',    label: '00',  name: 'Signal',        anchor: '#prologue'    },
  { id: 'signal',     label: '01',  name: 'Signal',        anchor: '#signal'      },
  { id: 'structure',  label: '02',  name: 'Structure',     anchor: '#structure'   },
  { id: 'aperture',   label: '03',  name: 'Aperture',      anchor: '#aperture'    },
  { id: 'the-work',   label: '04',  name: 'The Work',      anchor: '#the-work'    },
  { id: 'mechanism',  label: '05',  name: 'Mechanism',     anchor: '#mechanism'   },
  { id: 'telemetry',  label: '06',  name: 'Telemetry',     anchor: '#telemetry'   },
  { id: 'transmission', label: '07', name: 'Transmission', anchor: '#transmission'},
] as const;

export type ChapterId = typeof CHAPTERS[number]['id'];

// ─── Named Easing Curves (CSS string form for inline use) ─────────────────────
export const EASING = {
  signal:     'cubic-bezier(0.16, 1, 0.3, 1)',  // easeSignal: fast-start, elegant settle
  cine:       'cubic-bezier(0.77, 0, 0.175, 1)', // easeCine:   slow in, slow out, cinematic weight
  instrument: 'cubic-bezier(0.4, 0, 0.2, 1)',   // easeInstrument: precision ease-in-out
} as const;

// ─── Animation Durations (ms) ─────────────────────────────────────────────────
export const DURATION = {
  fast:   300,
  base:   600,
  slow:  1000,
  cinematic: 1400,
} as const;
