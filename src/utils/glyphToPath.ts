/**
 * utils/glyphToPath.ts
 *
 * GLYPH-TO-SVG-PATH PIPELINE
 *
 * Wraps opentype.js for extracting real glyph outlines as SVG path data.
 * Used by: Chapter I, II, V, VII stroke-draw animations.
 *
 * Status: Documented pipeline — ready for activation when font files arrive.
 * Current fallback: SVG text with getComputedTextLength() + clip-path reveal.
 *
 * To activate:
 * 1. `npm install opentype.js`
 * 2. Place font files in /public/fonts/ (e.g. pp-neue-montreal-regular.woff2)
 * 3. Uncomment the opentype import and the extractGlyphPaths function body.
 *
 * The returned GlyphPath[] is consumed directly by signalTimeline.ts.
 */

// import opentype from 'opentype.js';

export interface GlyphPath {
  char: string;
  pathData: string;       // SVG path `d` attribute string
  advance: number;        // Advance width in font units
  bounds: {
    x1: number; y1: number; x2: number; y2: number;
  };
}

/**
 * Extracts SVG path data for each character in `text` from the given font URL.
 * Returns an array of GlyphPath objects in character order.
 *
 * @param fontUrl - URL to a .ttf, .otf, or .woff2 font file (must be accessible)
 * @param text    - The string to extract paths for (e.g. "BINORE")
 * @param fontSize - Font size in px (scales the path coordinates)
 */
export async function extractGlyphPaths(
  _fontUrl: string,
  _text: string,
  _fontSize: number
): Promise<GlyphPath[]> {
  // ─── When font files are available, replace this body: ───────────────
  //
  // const font = await opentype.load(fontUrl);
  // const paths: GlyphPath[] = [];
  // let x = 0;
  // for (const char of text) {
  //   const glyph = font.charToGlyph(char);
  //   const path = glyph.getPath(x, 0, fontSize);
  //   paths.push({
  //     char,
  //     pathData: path.toSVG(2),     // 2 decimal precision
  //     advance: glyph.advanceWidth ?? 0,
  //     bounds: path.getBoundingBox(),
  //   });
  //   x += (glyph.advanceWidth ?? 0) * (fontSize / font.unitsPerEm);
  // }
  // return paths;
  //
  // ─────────────────────────────────────────────────────────────────────

  // Placeholder: return empty array — animation falls back to SVG text approach
  console.warn('[glyphToPath] Font files not yet available. Using SVG text fallback.');
  return [];
}

/**
 * getTextLength() — browser-native equivalent for a rendered SVG <text> element.
 * Use this in useEffect to measure actual rendered glyph lengths for dasharray.
 *
 * @param svgTextEl - A mounted SVG <text> DOM element
 */
export function getTextLength(svgTextEl: SVGTextElement): number {
  return svgTextEl.getComputedTextLength();
}
