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
      'Full-Stack Developer Intern. Built an AI-powered advisory chatbot from the ground up — end-to-end, from prompt engineering to deployment.',
    tech: 'React · Node.js · OpenAI API · MongoDB',
    side: 'left',
    baseZ: -20,
  },
  {
    id: 2,
    category: 'INTERNSHIP',
    title: 'Suvidha Foundation',
    description:
      'Full-Stack Developer Intern. Built Research Connect — a real-time research collaboration platform connecting researchers across institutions.',
    tech: 'Next.js · Spring Boot · PostgreSQL · WebSockets',
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

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { isReducedMotionActive } = useReducedMotion();

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

            // Text envelope — flat/2D, no 3D applied
            if (textBlock) {
              const op = windowOpacity(progress, range.enterStart, range.enterEnd, range.exitStart, range.exitEnd);
              const ty = op < 1 && progress < range.enterEnd ? 24 * (1 - op) : 0;
              gsap.set(textBlock, { opacity: op, y: ty });
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
    };
  }, [pathD, nodePositions, nodeScrollRanges, isReducedMotionActive, minZ, maxZ]);

  const isMobile = dimensions.width > 0 && dimensions.width < 768;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#a8adac]"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
      aria-label="Experience timeline"
    >

      {/* ── Section label — flat, above 3D layer ── */}
      <div className="relative z-20 pt-24 pb-8 text-center pointer-events-none">
        <h2
          className="text-3xl font-bold tracking-[0.2em] uppercase text-[#181a1b]"
          style={{ fontFamily: 'var(--font-mono, monospace)' }}
        >
          Experience
        </h2>
        <div className="w-24 h-1 bg-[#d97757] mx-auto mt-6 rounded-full" />
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
                stroke="#d97757"
                strokeWidth="1.5"
                opacity="0.08"
                strokeLinecap="round"
                strokeDasharray="6 8"
              />

              {/* Animated drawn path */}
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="#d97757"
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
                    background: 'radial-gradient(circle, rgba(217,119,87,var(--glow-opacity,0.2)) 0%, transparent 70%)',
                    filter: 'blur(var(--glow-blur, 4px))',
                    pointerEvents: 'none',
                  }}
                />
                {/* Core dot */}
                <div
                  className="absolute inset-0 rounded-full border border-[#d97757]"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #f0a080, #d97757 60%, #b85c3a)',
                    boxShadow: '0 0 8px rgba(217,119,87,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
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
      {nodePositions.map((pos, i) => {
        const node = EXPERIENCE_NODES[i];
        const isLeft = node.side === 'left';

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
              maxWidth: '36%',
            };

        return (
          <div
            key={node.id}
            ref={(el) => setTextBlockRef(el, i)}
            className="z-30 pointer-events-auto"
            style={{ ...textStyle, opacity: 0 }}
          >
            {/* Card Container */}
            <div 
              className="bg-[#181a1b] p-6 sm:p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 backdrop-blur-md text-left"
              style={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
              }}
            >
              {/* Category pill */}
              <div
                className="inline-block text-[10px] uppercase tracking-[0.28em] font-bold mb-3 px-3 py-1 bg-[#d97757]/10 rounded-full"
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  color: '#d97757',
                }}
              >
                {node.category}
              </div>

              {/* Title */}
              <h3
                className="text-xl sm:text-2xl font-bold tracking-tight mb-3 leading-tight"
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  color: '#ffffff',
                }}
              >
                {node.title}
              </h3>

              {/* Divider line */}
              <div
                className="mb-4"
                style={{
                  height: '1px',
                  background: 'linear-gradient(to right, rgba(217,119,87,0.5), transparent)',
                  width: '100%',
                }}
              />

              {/* Description */}
              <p
                className="text-[14px] leading-relaxed mb-4"
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  color: '#a8adac',
                }}
              >
                {node.description}
              </p>

              {/* Tech tags */}
              {node.tech && (
                <div
                  className="text-[12px] uppercase tracking-wider font-semibold"
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    color: '#2dd4bf',
                  }}
                >
                  {node.tech}
                </div>
              )}
            </div>
          </div>
        );
      })}

    </section>
  );
}
