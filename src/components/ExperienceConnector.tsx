'use client';

/**
 * ExperienceConnector — 3D Connector Path
 *
 * Architecture decision: SVG-with-perspective-tilt over DOM-segment-3D.
 * Reasoning: DOM-segment approach needs 80-100+ divs for a smooth line —
 * heavy reflow and Z-fighting. Instead we tilt the whole SVG canvas in 3D
 * (rotateX ~10°) which creates genuine perspective foreshortening on the
 * path curves. Individual node "orbs" are separate DOM elements positioned
 * over the SVG coordinates, so they get their own Z depth and can
 * translate forward/back on activation. Text blocks live outside the 3D
 * container entirely — flat, screen-aligned, always crisp.
 *
 * Depth-cue logic (mirrors ProjectsOrbit pattern):
 *   Z depth per node: [-80, -30, +30, +80]px (back → front)
 *   Active node: pushes further forward (+40px) + scale(1.3) + bright glow
 *   Inactive nodes: recede (-20px) + scale(0.7) + dim + slight blur
 *   Glow intensity mapped to Z: nearer = stronger blur + opacity on glow ring
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/providers/ReducedMotionProvider';
import { useAdaptiveQuality } from '@/hooks/useAdaptiveQuality';

gsap.registerPlugin(ScrollTrigger);

// ─── Node Data ─────────────────────────────────────────────────────────────────
interface ExperienceNode {
  id: number;
  category: string;
  title: string;
  description: string;
  tech?: string;
  side: 'left' | 'right';
  /** Base Z-depth in px. Negative = further back, positive = closer. */
  baseZ: number;
}

const EXPERIENCE_NODES: ExperienceNode[] = [
  {
    id: 1,
    category: 'INTERNSHIP',
    title: 'OM Associates',
    description:
      'Full-Stack Developer Intern. Built an AI-powered tax advisory chatbot integrating live GST compliance data (Central GST & UTGST, sourced from GST Council) and income-tax calculation logic aligned with the official ITR-1 (Sahaj) filing guidelines — end-to-end, from prompt engineering to deployment.',
    tech: 'React · Node.js · Gemini API · PostgreSQL',
    side: 'left',
    baseZ: -20,
  },
  {
    id: 2,
    category: 'INTERNSHIP',
    title: 'Suvidha Foundation',
    description:
      'Full-Stack Developer Intern. Built Research Connect — a real-time research collaboration platform connecting researchers across institutions.',
    tech: 'React · Node.js · MongoDB · WebSockets · Google Scholar API',
    side: 'right',
    baseZ: 40,
  }
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const windowOpacity = (
  p: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number | null,
  exitEnd: number | null
) => {
  if (p < enterStart) return 0;
  if (p < enterEnd) return (p - enterStart) / (enterEnd - enterStart);
  if (exitStart === null || exitEnd === null || p < exitStart) return 1;
  if (p < exitEnd) return 1 - (p - exitStart) / (exitEnd - exitStart);
  return 0;
};

/** Map a Z value to a glow blur intensity. Further back = less blur. */
const zToGlowBlur = (z: number, minZ: number, maxZ: number): number => {
  const t = (z - minZ) / (maxZ - minZ); // 0 = furthest back, 1 = nearest
  return 3 + t * 9; // blur 3px (back) → 12px (front)
};

/** Map a Z value to node scale. */
const zToScale = (z: number, minZ: number, maxZ: number): number => {
  const t = (z - minZ) / (maxZ - minZ);
  return 0.65 + t * 0.35; // 0.65 (back) → 1.0 (front)
};

/** Build S-curve SVG path — same algorithm as before */
function buildConnectorPath(
  width: number,
  height: number,
  nodes: ExperienceNode[],
  nodeCount: number
): { d: string; nodePositions: { x: number; y: number; t: number }[] } {
  const centerX = width / 2;
  const amplitude = Math.min(width * 0.20, 180);
  const paddingTop = height * 0.15;
  const paddingBottom = height * 0.25;
  const usableHeight = height - paddingTop - paddingBottom;

  const positions = nodes.map((node, i) => {
    const yFrac = (i + 0.5) / nodeCount;
    const y = paddingTop + yFrac * usableHeight;
    const x = node.side === 'right' ? centerX + amplitude : centerX - amplitude;
    return { x, y, t: 0 };
  });

  const startY = paddingTop * 0.4;
  const endY = height - paddingBottom * 0.4;
  let d = `M ${centerX},${startY}`;

  const firstNode = positions[0];
  d += ` C ${centerX},${startY + (firstNode.y - startY) * 0.4} ${firstNode.x},${startY + (firstNode.y - startY) * 0.7} ${firstNode.x},${firstNode.y}`;

  for (let i = 0; i < positions.length - 1; i++) {
    const curr = positions[i];
    const next = positions[i + 1];
    const dy = next.y - curr.y;
    d += ` C ${curr.x},${curr.y + dy * 0.35} ${next.x},${curr.y + dy * 0.65} ${next.x},${next.y}`;
  }

  const lastNode = positions[positions.length - 1];
  d += ` C ${lastNode.x},${lastNode.y + (endY - lastNode.y) * 0.3} ${centerX},${lastNode.y + (endY - lastNode.y) * 0.7} ${centerX},${endY}`;

  return { d, nodePositions: positions };
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ExperienceConnector() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scene3DRef = useRef<HTMLDivElement>(null);   // the tilted 3D container
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nodeOrbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idleAnimRef = useRef<gsap.core.Tween | null>(null);
  const nodeActiveStateRef = useRef<boolean[]>([]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { isReducedMotionActive } = useReducedMotion();
  const [cardVariant, setCardVariant] = useState('option2');

  useEffect(() => {
    const handleVariantChange = (e: Event) => setCardVariant((e as CustomEvent).detail);
    window.addEventListener('cardVariantChange', handleVariantChange);
    return () => window.removeEventListener('cardVariantChange', handleVariantChange);
  }, []);

  const setNodeOrbRef = useCallback((el: HTMLDivElement | null, i: number) => {
    nodeOrbRefs.current[i] = el;
  }, []);
  const setTextBlockRef = useCallback((el: HTMLDivElement | null, i: number) => {
    textBlockRefs.current[i] = el;
  }, []);

  const SECTION_HEIGHT_VH = 250;

  // Z range for depth-cue normalization
  const zValues = EXPERIENCE_NODES.map((n) => n.baseZ);
  const minZ = Math.min(...zValues);
  const maxZ = Math.max(...zValues);

  // Measure section dimensions
  useEffect(() => {
    const measure = () => {
      if (sectionRef.current) {
        setDimensions({
          width: sectionRef.current.offsetWidth,
          height: sectionRef.current.scrollHeight,
        });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute path + positions
  const { pathD, nodePositions } = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return { pathD: '', nodePositions: [] };
    const { d, nodePositions: pos } = buildConnectorPath(
      dimensions.width,
      dimensions.height,
      EXPERIENCE_NODES,
      EXPERIENCE_NODES.length
    );
    return { pathD: d, nodePositions: pos };
  }, [dimensions]);

  // Text reveal scroll ranges
  const nodeScrollRanges = useMemo(() => {
    const n = EXPERIENCE_NODES.length;
    return EXPERIENCE_NODES.map((_, i) => {
      const seg = 1 / n;
      return {
        enterStart: i * seg + seg * 0.05,
        enterEnd: i * seg + seg * 0.30,
        exitStart: i === n - 1 ? null : (i + 1) * seg - seg * 0.25,
        exitEnd: i === n - 1 ? null : (i + 1) * seg,
        pathT: (i + 0.5) / n,
      };
    });
  }, []);

  // ─── GSAP: scroll-driven path draw + node depth activation ──────────
  useEffect(() => {
    if (!sectionRef.current || !pathRef.current || !pathD || nodePositions.length === 0) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    // Resolve each node's fractional t along the path
    nodePositions.forEach((pos) => {
      let bestT = 0, bestDist = Infinity;
      for (let s = 0; s <= 200; s++) {
        const len = (s / 200) * pathLength;
        const pt = path.getPointAtLength(len);
        const dist = Math.abs(pt.y - pos.y) + Math.abs(pt.x - pos.x) * 0.4;
        if (dist < bestDist) { bestDist = dist; bestT = s / 200; }
      }
      pos.t = bestT;
    });

    const ctx = gsap.context(() => {

      // ── Reduced motion: show everything statically ──────────────────
      if (isReducedMotionActive) {
        gsap.set(path, { attr: { 'stroke-dashoffset': 0 } });
        nodeOrbRefs.current.forEach((orb, i) => {
          if (!orb) return;
          const scale = zToScale(EXPERIENCE_NODES[i].baseZ, minZ, maxZ);
          gsap.set(orb, { scale, opacity: 1, z: EXPERIENCE_NODES[i].baseZ });
        });
        textBlockRefs.current.forEach((b) => b && gsap.set(b, { opacity: 1, y: 0 }));
        return;
      }

      // ── Initial states ──────────────────────────────────────────────
      gsap.set(path, { attr: { 'stroke-dasharray': pathLength, 'stroke-dashoffset': pathLength } });

      nodeOrbRefs.current.forEach((orb, i) => {
        if (!orb) return;
        const node = EXPERIENCE_NODES[i];
        const baseScale = zToScale(node.baseZ, minZ, maxZ);
        gsap.set(orb, {
          scale: baseScale * 0.6,
          opacity: 0.15,
          z: node.baseZ - 40, // starts further back
          force3D: true,
        });
      });

      textBlockRefs.current.forEach((b) => b && gsap.set(b, { opacity: 0, y: 24 }));

      // ── Scroll trigger ──────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;

          // Draw path
          gsap.set(path, { attr: { 'stroke-dashoffset': pathLength * (1 - progress) } });

          nodePositions.forEach((pos, i) => {
            const node = EXPERIENCE_NODES[i];
            const orb = nodeOrbRefs.current[i];
            const textBlock = textBlockRefs.current[i];
            const range = nodeScrollRanges[i];
            if (!orb) return;

            const isReached = progress >= pos.t;
            const baseScale = zToScale(node.baseZ, minZ, maxZ);
            const baseGlowBlur = zToGlowBlur(node.baseZ, minZ, maxZ);

            if (isReached) {
              // Surge forward in Z, scale up, max brightness
              gsap.to(orb, {
                scale: baseScale * 1.3,
                opacity: 1,
                z: node.baseZ + 40,
                force3D: true,
                duration: 0.5,
                ease: 'power3.out',
                overwrite: 'auto',
              });
              // Dial up the glow blur via CSS variable on the orb
              (orb as HTMLElement).style.setProperty('--glow-blur', `${baseGlowBlur + 8}px`);
              (orb as HTMLElement).style.setProperty('--glow-opacity', '0.9');
            } else {
              // Recede back, shrink, dim
              gsap.to(orb, {
                scale: baseScale * 0.6,
                opacity: 0.15 + (pos.t > 0 ? 0 : 0),
                z: node.baseZ - 40,
                force3D: true,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto',
              });
              (orb as HTMLElement).style.setProperty('--glow-blur', `${Math.max(baseGlowBlur * 0.4, 2)}px`);
              (orb as HTMLElement).style.setProperty('--glow-opacity', '0.2');
            }

            // Text envelope — flat/2D, no 3D applied, entrance/exit triggered via GSAP timelines
            if (textBlock) {
              const isActive = progress >= range.enterStart && (range.exitStart === null || progress < range.exitStart);

              if (isActive !== nodeActiveStateRef.current[i]) {
                nodeActiveStateRef.current[i] = isActive;

                if (isActive) {
                  // Entrance animation - now swings in with rotateY for depth
                  gsap.fromTo(textBlock,
                    { opacity: 0, scale: 0.96, y: 12, rotateY: -8 },
                    { opacity: 1, scale: 1, y: 0, rotateY: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }
                  );
                } else {
                  // Exit animation
                  gsap.to(textBlock, { opacity: 0, scale: 0.97, y: 12, rotateY: 4, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
                }
              }
            }
          });
        },
      });

      // ── Idle 3D sway on the whole scene container ───────────────────
      // Mimics ProjectsOrbit's idle float but in 3D — gentle rotateY oscillation
      if (scene3DRef.current) {
        idleAnimRef.current = gsap.to(scene3DRef.current, {
          rotateY: 4,          // sway ±4° on Y axis
          rotateX: -2,         // breathe ±2° on X
          duration: 6,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

    }, sectionRef);

    return () => {
      idleAnimRef.current?.kill();
      ctx.revert();
      nodeActiveStateRef.current = [];
    };
  }, [pathD, nodePositions, nodeScrollRanges, isReducedMotionActive, minZ, maxZ]);

  const isMobile = dimensions.width > 0 && dimensions.width < 768;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[var(--bg-primary)]"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
      aria-label="Experience timeline"
    >
      <style>{`
        @keyframes panelBreathe {
          0%, 100% { box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 15%, transparent); }
          50% { box-shadow: 0 0 25px color-mix(in srgb, var(--color-accent) 30%, transparent); }
        }
        .panel-breathe {
          animation: panelBreathe 4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .panel-breathe {
            animation: none;
            box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 20%, transparent);
          }
        }
      `}</style>


      {/* ── Section label — flat, above 3D layer ── */}
      <div className="relative z-20 pt-24 pb-8 text-center pointer-events-none">
        <h2
          className="text-3xl font-bold tracking-[0.2em] uppercase"
          style={{ fontFamily: 'Technor, sans-serif', color: 'var(--text-primary)' }}
        >
          Experience
        </h2>
        <div className="w-24 h-1 bg-[var(--color-accent)] mx-auto mt-6 rounded-full" />
      </div>

      {/*
        ── 3D SCENE CONTAINER ──────────────────────────────────────────────
        CSS perspective on this div creates the vanishing point.
        scene3DRef gets the idle rotateY/rotateX sway animation.
        The SVG path + node orbs live inside preserve-3d space here.
        Text blocks intentionally live OUTSIDE this container.
      */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}
      >
        <div
          ref={scene3DRef}
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            // Initial tilt: rotateX gives the path a "looking down the corridor" feel
            // 10° is enough to show depth without distorting the layout
            transform: 'rotateX(10deg) rotateY(0deg)',
          }}
        >

          {/* SVG path layer — tilted with the scene */}
          {pathD && (
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                {/* Base glow — always on the drawn line */}
                <filter id="lineGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ghost path — full length, very dim, shows the road ahead */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                opacity="0.2"
                strokeLinecap="round"
                strokeDasharray="6 8"
              />

              {/* Animated drawn path */}
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#lineGlow)"
              />
            </svg>
          )}

          {/*
            Node Orbs — absolutely positioned over their SVG coordinates.
            Each orb has its own translateZ from node.baseZ via GSAP force3D.
            CSS custom properties --glow-blur and --glow-opacity are set by
            the scroll handler to modulate glow intensity per depth.
          */}
          {nodePositions.map((pos, i) => {
            const node = EXPERIENCE_NODES[i];
            const baseScale = zToScale(node.baseZ, minZ, maxZ);
            const baseBlur = zToGlowBlur(node.baseZ, minZ, maxZ);
            // Use pixel positions from the SVG coordinate system
            const orbSize = 14; // px radius equivalent → 28px total
            return (
              <div
                key={node.id}
                ref={(el) => setNodeOrbRef(el, i)}
                className="absolute"
                style={{
                  left: pos.x - orbSize,
                  top: pos.y - orbSize,
                  width: orbSize * 2,
                  height: orbSize * 2,
                  willChange: 'transform, opacity',
                  // CSS custom props for glow — set by JS on activation
                  ['--glow-blur' as string]: `${baseBlur * 0.4}px`,
                  ['--glow-opacity' as string]: '0.2',
                }}
              >
                {/* Outer glow ring — intensity driven by --glow-blur */}
                <div
                  className="absolute inset-[-100%] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent) var(--glow-opacity, 20%), transparent) 0%, transparent 70%)',
                    filter: 'blur(var(--glow-blur, 4px))',
                    pointerEvents: 'none',
                  }}
                />
                {/* Core dot */}
                <div
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, color-mix(in srgb, var(--color-accent) 80%, white), var(--color-accent) 60%, color-mix(in srgb, var(--color-accent) 60%, black))',
                    boxShadow: '0 0 8px color-mix(in srgb, var(--color-accent) 50%, transparent), inset 0 1px 0 rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                  }}
                />
                {/* Node index label — tiny, monospace */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.85)',
                    letterSpacing: '0.05em',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}

        </div>{/* /scene3DRef */}
      </div>{/* /perspective container */}

      {/*
        ── TEXT BLOCKS — flat, outside 3D container, always screen-aligned ──
        Positioned absolutely over the same coordinates as the SVG nodes,
        but NOT wrapped in any preserve-3d context. Pure 2D screen space.
      */}
      {nodePositions.map((pos, i) => (
        <ExperienceCard
          key={EXPERIENCE_NODES[i].id}
          node={EXPERIENCE_NODES[i]}
          pos={pos}
          index={i}
          isMobile={isMobile}
          setTextBlockRef={setTextBlockRef}
          cardVariant={cardVariant}
        />
      ))}

    </section>
  );
}

// ─── Subcomponent: Experience Card (Handles Tilt & Parallax) ───────────────
function ExperienceCard({ node, pos, index, isMobile, setTextBlockRef, cardVariant }: any) {
  const isLeft = node.side === 'left';
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const backingRef = useRef<HTMLDivElement>(null);
  const { tier } = useAdaptiveQuality();

  const textStyle: React.CSSProperties = isMobile
    ? {
      position: 'absolute',
      top: pos.y + 20,
      left: '8%',
      right: '8%',
      textAlign: 'center',
    }
    : {
      position: 'absolute',
      top: pos.y - 60,
      ...(isLeft
        ? { right: '54%', paddingRight: 48, textAlign: 'right' as const }
        : { left: '54%', paddingLeft: 48, textAlign: 'left' as const }),
      maxWidth: '40%', // slightly wider for glassmorphic padding
      perspective: '1000px', // needed for child 3D tilt
    };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || tier === 'low' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xNorm = (x / rect.width) * 2 - 1;
    const yNorm = (y / rect.height) * 2 - 1;

    const tiltX = xNorm * 8;
    const tiltY = yNorm * 8;

    // Direct DOM mutation avoids React setState jank (60fps)
    cardRef.current.style.transform = `rotateX(${-tiltY}deg) rotateY(${tiltX}deg)`;

    if (backingRef.current) {
      backingRef.current.style.transform = `translate(${8 - tiltX * 0.25}px, ${8 - tiltY * 0.25}px)`;
    }

    if (sheenRef.current) {
      sheenRef.current.style.background = `radial-gradient(circle at ${50 - tiltX * 3.75}% ${50 - tiltY * 3.75}%, rgba(255,255,255,0.5) 0%, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    if (isMobile || !cardRef.current) return;
    cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
    if (backingRef.current) {
      backingRef.current.style.transform = `translate(8px, 8px)`;
    }
    if (sheenRef.current) {
      sheenRef.current.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 60%)`;
    }
  };

  return (
    <div
      ref={(el) => setTextBlockRef(el, index)}
      className="z-30 pointer-events-auto group"
      style={{ ...textStyle, opacity: 0 }}
    >
      {/* Inner wrapper bound to card size */}
      <div
        ref={cardRef}
        className="relative w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(0deg) rotateY(0deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* 1. SOLID BACKING LAYER (The literal thickness) */}
        <div
          ref={backingRef}
          className="absolute inset-0 rounded-md bg-[#0d0f12] pointer-events-none shadow-[-20px_20px_40px_rgba(0,0,0,0.4)]"
          style={{
            transform: `translate(8px, 8px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />

        {/* Connector dot - embedded in the top-left/right gap */}
        <div
          className={`absolute -top-1 w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)] ${isMobile ? 'hidden' : isLeft ? '-right-1 translate-x-1/2' : '-left-1 -translate-x-1/2'
            } z-20 transition-opacity duration-300`}
        />

        {/* ── CARD VARIANTS ── */}
        {cardVariant === 'option1' && (
          <div className="relative w-full h-full p-8 sm:p-10 rounded-md border border-[var(--color-accent)] bg-transparent text-left overflow-hidden z-10 transition-colors duration-300 hover:bg-[var(--color-accent)]/5 shadow-none hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]">
            <div className="relative z-20">
              <div className="inline-block text-[10px] uppercase tracking-[0.28em] font-bold mb-3 px-3 py-1 bg-transparent border border-[var(--color-accent)] rounded-full text-[var(--color-accent)] font-mono">
                {node.category}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 leading-tight text-[var(--text-primary)] font-mono">
                {node.title}
              </h3>
              <div className="mb-4 h-px w-full bg-[var(--color-accent)]/40" />
              <p className="text-[14px] leading-relaxed mb-6 text-[var(--text-primary)]/80 font-mono">
                {node.description}
              </p>
              {node.tech && (
                <div className="text-[12px] uppercase tracking-wider font-semibold flex flex-wrap gap-2 font-mono">
                  {node.tech.split('·').map((tag: string) => (
                    <span key={tag} className="text-[var(--color-accent)] hover:scale-105 transition-all duration-200 cursor-default inline-block">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {cardVariant === 'option2' && (
          <div className="relative w-full h-full p-8 sm:p-10 rounded-2xl bg-[#181a1b] border border-white/10 text-left overflow-hidden z-10 transition-all duration-500 group-hover:border-[var(--color-accent)] group-hover:shadow-[0_0_25px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]">
            <div className="relative z-20">
              <div className="inline-block text-[10px] uppercase tracking-[0.28em] font-bold mb-4 px-3 py-1 bg-white text-black rounded-full font-sans">
                {node.category}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 leading-tight text-white font-sans">
                {node.title}
              </h3>
              <p className="text-[14px] leading-relaxed mb-6 text-white/80 font-sans">
                {node.description}
              </p>
              {node.tech && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-bold tracking-widest uppercase font-mono text-[var(--color-accent)]">
                  {node.tech.split('·').map((tag: string) => (
                    <span key={tag} className="inline-block">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {cardVariant === 'option3' && (
          <div className="relative w-full h-full rounded-md bg-black border border-white/20 text-left overflow-hidden z-10 flex flex-col">
            <div className="h-6 bg-white/10 flex items-center px-3 gap-1.5 shrink-0 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="ml-2 text-[10px] font-mono text-white/50">~/experience/{node.title.toLowerCase().replace(/\s+/g, '-')}</span>
            </div>
            <div className="p-6 sm:p-8 relative z-20 flex-1">
              <p className="text-[10px] uppercase font-bold mb-3 text-[var(--color-accent)] font-mono">&gt; ./run_experience</p>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 leading-tight text-white font-mono">
                {node.title}<span className="animate-blink inline-block w-3 h-6 bg-[var(--color-accent)] ml-2 align-middle" />
              </h3>
              <p className="text-[14px] leading-relaxed mb-6 text-white/70 font-mono">
                {node.description}
              </p>
              {node.tech && (
                <div className="text-[12px] uppercase tracking-wider font-semibold flex flex-wrap gap-2 font-mono">
                  {node.tech.split('·').map((tag: string) => (
                    <span key={tag} className="text-white/40 inline-block before:content-['#'] before:mr-0.5">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
