'use client';

import React, { useEffect, useRef, useMemo, useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Landmark, MessageSquare, Building2, BookOpen, ShieldCheck, Code2, Bot } from 'lucide-react';
import { useDeviceTier, type DeviceTier } from '@/hooks/useDeviceTier';

gsap.registerPlugin(ScrollTrigger);

const DnaCanvas = dynamic(() => import('./DnaCanvas'), { ssr: false });

// ---------------------------------------------------------------------------
// Fallback SVG DNA Helix (used if WebGL/Canvas fails to initialize)
// ---------------------------------------------------------------------------
function DnaHelixSvg() {
  const STRAND_POINTS = 40;
  const WIDTH = 160;
  const HEIGHT = 220;
  const AMPLITUDE = 46;
  const TURNS = 2.5;

  const buildStrand = (phaseOffset: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= STRAND_POINTS; i++) {
      const t = i / STRAND_POINTS;
      const y = t * HEIGHT;
      const x = WIDTH / 2 + Math.sin(t * Math.PI * 2 * TURNS + phaseOffset) * AMPLITUDE;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M ${pts.join(' L ')}`;
  };

  const strandA = buildStrand(0);
  const strandB = buildStrand(Math.PI);

  const rungs = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 0.5) / 9;
    const y = t * HEIGHT;
    const angle = t * Math.PI * 2 * TURNS;
    const xA = WIDTH / 2 + Math.sin(angle) * AMPLITUDE;
    const xB = WIDTH / 2 + Math.sin(angle + Math.PI) * AMPLITUDE;
    return { y, xA, xB };
  });

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{
        animation: 'dnaSpin 14s linear infinite',
        transformStyle: 'preserve-3d',
        perspective: '600px',
      }}
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="opacity-70"
      >
        <defs>
          <filter id="dnaGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {rungs.map((r, idx) => (
          <line
            key={idx}
            x1={r.xA}
            y1={r.y}
            x2={r.xB}
            y2={r.y}
            stroke="#d97757"
            strokeWidth="1"
            opacity="0.35"
            filter="url(#dnaGlow)"
          />
        ))}

        <path
          d={strandA}
          fill="none"
          stroke="#d97757"
          strokeWidth="1.6"
          opacity="0.9"
          filter="url(#dnaGlow)"
        />
        <path
          d={strandB}
          fill="none"
          stroke="#e8eaea"
          strokeWidth="1.6"
          opacity="0.55"
          filter="url(#dnaGlow)"
        />

        {rungs.map((r, idx) => (
          <g key={`dots-${idx}`}>
            <circle cx={r.xA} cy={r.y} r="2" fill="#d97757" filter="url(#dnaGlow)" />
            <circle cx={r.xB} cy={r.y} r="2" fill="#e8eaea" opacity="0.6" filter="url(#dnaGlow)" />
          </g>
        ))}
      </svg>

      <style jsx>{`
        @keyframes dnaSpin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
}


const PROJECTS = [
  { id: 8, title: 'OM Associates', category: 'TypeScript', github: 'https://github.com/binoremohapatra/om-associates', link: 'https://om-associates.vercel.app' },
  { id: 2, title: 'Research.connect', category: 'Project', github: 'https://github.com/binoremohapatra/Research.connect', link: 'https://research-connect-pink.vercel.app', iframeDisabled: true, image: '/images/research-connect.png' },
  { id: 4, title: 'SubMeter', category: 'Java', github: 'https://github.com/binoremohapatra/submeter', link: 'https://submeter-lac.vercel.app' },
  { id: 12, title: 'Portfolio v2', category: 'JavaScript', github: 'https://github.com/binoremohapatra/binore-portfolio', link: 'https://binore-portfolio.vercel.app' },
  { id: 13, title: 'Portfolio Binore', category: 'JavaScript', github: 'https://github.com/binoremohapatra/Portfolio-Binore', link: 'https://portfolio-binore.vercel.app' },
  { id: 6, title: 'ReactorX', category: 'JavaScript', github: 'https://github.com/binoremohapatra/reactorx', link: 'https://reactorx-chi.vercel.app' },
  { id: 1, title: 'SwiftRoute', category: 'JavaScript', github: 'https://github.com/binoremohapatra/SwiftRoute', link: 'https://swiftroute-ten.vercel.app' },
  { id: 10, title: 'SheCan Foundation', category: 'TypeScript', github: 'https://github.com/binoremohapatra/shecanfoundation', link: 'https://shecanfoundation-tan.vercel.app' },
  { id: 9, title: 'Naye Pankh Foundation', category: 'TypeScript', github: 'https://github.com/binoremohapatra/nayepankhfoundation', link: 'https://nayepankhfoundation-p6ii.vercel.app' },
  { id: 3, title: 'Mavis AI', category: 'TypeScript', github: 'https://github.com/binoremohapatra/mavisai', link: 'https://mavisai.vercel.app' },
  { id: 5, title: 'CivicSolver', category: 'JavaScript', github: 'https://github.com/binoremohapatra/Civicsolver', link: 'https://civicsolver.vercel.app' },
  { id: 99, title: 'Maeve AI', category: 'Python', github: null, link: null },
  { id: 14, title: 'CityVoice', category: 'Dart', github: 'https://github.com/binoremohapatra/CityVoice', link: null },
  { id: 15, title: 'civicsolverapp', category: 'Dart', github: 'https://github.com/binoremohapatra/civicsolverapp', link: null },
  { id: 20, title: 'mavisai-core', category: 'Java', github: 'https://github.com/binoremohapatra/mavisai-core', link: null },
  { id: 23, title: 'Suraksha-Setu-tourist-safety-app', category: 'Project', github: 'https://github.com/binoremohapatra/Suraksha-Setu-tourist-safety-app', link: null },
  { id: 11, title: 'Library System', category: 'Java', github: 'https://github.com/binoremohapatra/library-management-system', link: null },
  { id: 17, title: 'bankmangementsystem', category: 'Java', github: 'https://github.com/binoremohapatra/bankmangementsystem', link: null },
];

// ---------------------------------------------------------------------------
// 3D DNA Helix — rendered via React Three Fiber.
// ---------------------------------------------------------------------------

function DnaWrapper({ tier }: { tier: DeviceTier }) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // LOW tier: skip WebGL entirely, use SVG fallback
    if (tier === 'LOW') {
      setWebglSupported(false);
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch (e) {
      setWebglSupported(false);
    }
  }, [tier]);

  if (webglSupported === null) {
    return <div className="absolute inset-0 pointer-events-none z-0 opacity-80" />;
  }

  if (!webglSupported) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
        <div className="absolute inset-0 opacity-50">
          <DnaHelixSvg />
        </div>
      </div>
    );
  }

  return <DnaCanvas fallbackSvg={<DnaHelixSvg />} />;
}

// ---------------------------------------------------------------------------

const PLACEHOLDER_CONFIG: Record<string, { icon: any, color: string, label: string, pattern: string, patternSize?: string }> = {
  'civicsolverapp': {
    icon: Landmark,
    color: '#60a5fa', // Cool blue
    label: 'CIVIC TECH',
    pattern: 'linear-gradient(to right, rgba(96,165,250,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(96,165,250,0.08) 1px, transparent 1px)',
    patternSize: '20px 20px'
  },
  'CityVoice': {
    icon: MessageSquare,
    color: '#f59e0b', // Amber
    label: 'PUBLIC SERVICE',
    pattern: 'repeating-radial-gradient(circle at center, transparent, transparent 12px, rgba(245,158,11,0.06) 13px, rgba(245,158,11,0.06) 14px)'
  },
  'bankmangementsystem': {
    icon: Building2,
    color: '#10b981', // Deep green
    label: 'FINANCE',
    pattern: 'repeating-linear-gradient(to bottom, transparent, transparent 24px, rgba(16,185,129,0.08) 25px)'
  },
  'Library System': {
    icon: BookOpen,
    color: '#8b5cf6', // Muted purple
    label: 'EDUCATION',
    pattern: 'repeating-linear-gradient(to right, transparent, transparent 18px, rgba(139,92,246,0.08) 19px, rgba(139,92,246,0.08) 24px)'
  },
  'Suraksha-Setu-tourist-safety-app': {
    icon: ShieldCheck,
    color: '#d97757', // Orange-red
    label: 'SECURITY',
    pattern: 'linear-gradient(30deg, rgba(217,119,87,0.07) 1px, transparent 1px), linear-gradient(-30deg, rgba(217,119,87,0.07) 1px, transparent 1px)',
    patternSize: '20px 34px'
  },
  'Maeve AI': {
    icon: Bot,
    color: '#ec4899', // Pink
    label: 'AI ASSISTANT',
    pattern: 'radial-gradient(circle, rgba(236,72,153,0.1) 1px, transparent 1px)',
    patternSize: '16px 16px'
  }
};

const DEFAULT_PLACEHOLDER = {
  icon: Code2,
  color: '#6b7280',
  label: 'DEVELOPMENT',
  pattern: 'radial-gradient(circle, rgba(107,114,128,0.1) 1px, transparent 1px)',
  patternSize: '16px 16px'
};

function PlaceholderPreview({ project }: { project: { title: string; category: string } }) {
  const config = PLACEHOLDER_CONFIG[project.title] || { ...DEFAULT_PLACEHOLDER, label: project.category.toUpperCase() };
  const Icon = config.icon;
  const color = config.color;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden"
      style={{ background: `radial-gradient(circle at center, ${color}40 0%, ${color}00 70%, #0d0f12 100%)`, backgroundColor: '#0d0f12' }}
    >
      <div
        className="absolute inset-0 z-0 mix-blend-screen"
        style={{
          backgroundImage: config.pattern,
          backgroundSize: config.patternSize || 'auto'
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        <Icon
          size={52}
          color="#ffffff"
          strokeWidth={1.5}
          style={{ filter: `drop-shadow(0 0 12px ${color}80) drop-shadow(0 0 24px ${color}40)` }}
        />
        <span
          className="font-mono text-xs uppercase tracking-[0.2em] font-bold"
          style={{ color: color, opacity: 0.85, textShadow: `0 0 10px ${color}60` }}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}

function ActiveOnlyIframe({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
    loadedRef.current = false;
    const timeout = setTimeout(() => {
      if (!loadedRef.current) setFailed(true);
    }, 4000); // if it hasn't loaded in 4s, assume blocked/broken
    return () => clearTimeout(timeout);
  }, [url]);

  if (failed) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 -rotate-12 select-none">
        Preview Unavailable
      </span>
    );
  }

  return (
    <iframe
      src={url}
      title="Live project preview"
      loading="lazy"
      onLoad={() => {
        setLoaded(true);
        loadedRef.current = true;
      }}
      onError={() => setFailed(true)}
      style={{
        width: '550%',
        height: '550%',
        transform: 'scale(0.18)',
        transformOrigin: 'top left',
        border: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function ProjectsOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dnaContainerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number>(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const { tier, isTouchDevice, prefersReducedMotion } = useDeviceTier();

  useEffect(() => {
    if (!containerRef.current || !rotorRef.current) return;

    const totalCards = PROJECTS.length;
    // Responsive radius: heavily increased on mobile so cards have room to breathe and don't overlap
    const vw = window.innerWidth;
    const radius = vw < 640 ? 450 : vw < 1024 ? 650 : 1400;
    const angleIncrement = 360 / totalCards;
    const yStep = 480 / totalCards;

    // Initial 3D placement
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const angle = i * angleIncrement;
      const yOffset = i * yStep;
      gsap.set(card, {
        rotationY: angle,
        z: radius,
        y: yOffset,
        transformOrigin: `50% 50% ${-radius}px`,
        force3D: true,
      });
    });

    // Cache DOM refs once instead of re-reading on every scroll tick
    const cardEls = cardsRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalCards * 350}`,
        scrub: tier === 'LOW' ? 2.5 : 1.2, // increased smoothing on LOW tier to absorb frame drops
        pin: true,
        onUpdate: (self) => {
          try {
            const progress = self.progress;
            // Mathematically perfect rotation to reach the final card
            const totalRotation = -(totalCards - 1) * angleIncrement;
            const currentRotorAngle = progress * totalRotation;

            let closestIndex = 0;
            let minDiff = Infinity;

            for (let i = 0; i < totalCards; i++) {
              const cardBaseAngle = i * angleIncrement;
              let worldAngle = (cardBaseAngle + currentRotorAngle) % 360;
              if (worldAngle < 0) worldAngle += 360;

              const diff = Math.min(worldAngle, 360 - worldAngle);
              if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
              }

              const card = cardEls[i];
              if (!card) continue;

              if (tier === 'LOW') {
                if (diff >= 45) {
                  // Only set it once when it crosses the threshold to avoid redundant GSAP sets per frame
                  if (!card.dataset.isFar) {
                    gsap.set(card, { opacity: 0.05, scale: 0.9, force3D: true });
                    card.dataset.isFar = 'true';
                  }
                  continue;
                } else {
                  card.dataset.isFar = '';
                }
              }

              // Adaptive depth cue: Opacity + scale only for maximum performance
              const opacity = gsap.utils.mapRange(0, 45, 1, 0.05, Math.min(diff, 45));
              const scale = gsap.utils.mapRange(0, 45, 1, 0.9, Math.min(diff, 45));

              gsap.set(card, { opacity, scale, force3D: true });
            }

            // Dynamic DNA Helix opacity: dim when a card is front-and-center (minDiff ~0), restore when transitioning
            const helixOpacity = gsap.utils.mapRange(0, 15, 0.35, 1, Math.min(minDiff, 15));
            if (dnaContainerRef.current) {
              gsap.set(dnaContainerRef.current, { opacity: helixOpacity, force3D: true });
            }

            // Only touch the DOM for cards whose active state actually changed —
            // no React setState here, so no re-render cascade on every tick.
            if (closestIndex !== activeIndexRef.current) {
              const prevCard = cardEls[activeIndexRef.current];
              const nextCard = cardEls[closestIndex];

              prevCard?.classList.remove('is-active');
              nextCard?.classList.add('is-active');

              if (nextCard) {
                gsap.fromTo(
                  nextCard,
                  { scale: 0.95 },
                  { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)', overwrite: 'auto' }
                );
              }

              activeIndexRef.current = closestIndex;
              setActiveCardIndex(closestIndex);
            }
          } catch (e) {
            console.error('ProjectsOrbit onUpdate error:', e);
          }
        },
      },
    });

    tl.to(rotorRef.current, {
      rotationY: -(totalCards - 1) * angleIncrement,
      y: -(totalCards - 1) * yStep,
      ease: 'none',
      force3D: true,
    });

    // Idle float — cheap, transform-only, GPU composited
    // Disabled on LOW tier and when user prefers reduced motion
    let floatAnim: gsap.core.Tween | null = null;
    if (tier !== 'LOW' && !prefersReducedMotion) {
      floatAnim = gsap.to(cardEls, {
        y: '+=10',
        rotationZ: () => Math.random() * 2 - 1,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: { amount: 1.5, from: 'random' },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      floatAnim?.kill();
    };
  }, [tier, isTouchDevice, prefersReducedMotion]);

  const [debugInfo, setDebugInfo] = useState('');
  useEffect(() => {
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 'N/A';
    const mem = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : 'N/A';
    setDebugInfo(`Cores: ${cores} | Mem: ${mem} | VW: ${window.innerWidth}`);
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#a8adac] text-gray-900 flex items-center justify-center scroll-touch-fix"
      style={{ perspective: tier === 'LOW' ? '2000px' : '4000px' }}
    >
      {/* DEBUG INDICATOR - TEMPORARY */}
      <div className="absolute top-24 left-4 z-[9999] bg-red-600 text-white text-xs p-2 font-mono rounded font-bold">
        TIER: {tier} | {debugInfo}
      </div>

      {/* Grain overlay (Disabled on LOW tier as SVG filters are expensive on mobile GPUs) */}
      {tier !== 'LOW' && (
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="projectsNoiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#projectsNoiseFilter)" />
          </svg>
        </div>
      )}

      {/* Center label — the DNA helix lives here ONCE */}
      <div
        ref={dnaContainerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none text-center"
      >
        {/* Constrain to the size of the active card preview so it doesn't clip other cards */}
        <div className="relative flex items-center justify-center w-screen h-screen">
          <DnaWrapper tier={tier} />
        </div>
      </div>

      {/* 3D Rotor */}
      <div
        ref={rotorRef}
        className="relative w-full h-full flex items-center justify-center pointer-events-none z-10"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className={`orbit-card absolute w-[160px] sm:w-[280px] md:w-[380px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl pointer-events-auto cursor-pointer group ${i === 0 ? 'is-active' : ''
              }`}
            style={{
              transformStyle: 'preserve-3d',
              willChange: i === activeCardIndex || Math.abs(i - activeCardIndex) <= 2 ? 'transform, opacity' : 'auto',
            }}
          >
            {/* Full-bleed preview fills the whole card */}
            <div className="absolute inset-0 z-0">
              {project.link ? (
                i === activeCardIndex && !(project as any).iframeDisabled && tier === 'HIGH' ? (
                  <ActiveOnlyIframe url={project.link} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(project as any).image || `https://image.thum.io/get/width/800/crop/800/${project.link}`}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                  />
                )
              ) : (
                <PlaceholderPreview project={project} />
              )}
            </div>

            {/* Hover/touch overlay with title/category/buttons */}
            <div className={`absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3 sm:p-4 ${isTouchDevice
                ? 'opacity-100' /* Always visible on touch — no hover on mobile */
                : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
              }`}>
              <p className="font-mono text-[8px] uppercase tracking-widest text-[#d97757] mb-1">{project.category}</p>
              <h3 className="text-xs sm:text-sm md:text-lg font-bold text-white mb-2">{project.title}</h3>
              <div className="flex gap-1.5">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                    className="px-2 py-1.5 sm:py-1 bg-[#d97757] text-white text-[8px] font-bold font-mono rounded-sm hover:bg-[#e4896a] inline-flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}>LIVE ↗</a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="px-2 py-1.5 sm:py-1 bg-white/10 text-white text-[8px] font-bold font-mono border border-white/20 rounded-sm hover:bg-white/20 inline-flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}>GITHUB</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #a8adac 100%)' }}
      />

      <style jsx>{`
        .orbit-card {
          transition: box-shadow 0.4s ease, border-color 0.4s ease, transform 0.3s ease;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .orbit-card:hover:not(.is-active) {
          transform: translateY(-16px) scale3d(1.03, 1.03, 1);
          filter: brightness(1.15) !important;
        }
        .orbit-card.is-active {
          box-shadow: 0 0 40px rgba(217, 119, 87, 0.4);
          border-color: rgba(217, 119, 87, 0.6);
        }
        /* Hide the DNA helix (and its per-frame CSS animation) on all cards
           except the active one — keeps only one helix animating at a time
           instead of 9 running simultaneously off-screen/blurred. */
        .active-only {
          display: contents;
          opacity: 0;
        }
        .orbit-card.is-active .preview-area .active-only {
          display: block;
          opacity: 1;
        }
        .orbit-card:not(.is-active) .preview-area {
          animation: none !important;
        }
        .card-links {
          opacity: 0;
          pointer-events: none;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }
        .orbit-card:hover .card-links {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}