'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import SplitText from '@/components/ui/reactbits/SplitText';
import BlurText from '@/components/ui/reactbits/BlurText';
import TextType from '@/components/ui/reactbits/TextType';
// @ts-ignore
import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.esm.jsx';

const windowOpacity = (p: number, enterStart: number, enterEnd: number, exitStart: number | null, exitEnd: number | null) => {
  if (p < enterStart) return 0;
  if (p < enterEnd) return (p - enterStart) / (enterEnd - enterStart); // fading in
  if (exitStart === null || exitEnd === null || p < exitStart) return 1; // holding
  if (p < exitEnd) return 1 - (p - exitStart) / (exitEnd - exitStart); // fading out
  return 0;
};

const getTransform = (p: number, enterStart: number, enterEnd: number, exitStart: number | null, exitEnd: number | null) => {
  const op = windowOpacity(p, enterStart, enterEnd, exitStart, exitEnd);
  // We keep the overall block completely static in y once it's visible, 
  // relying on the internal components (BlurText, SplitText, FadeUp) for the entrance motion.
  // The outer envelope just fades out.
  return { opacity: op, y: 0 };
};

function HeroStatText({ value, label, className = "", accentColor = "white" }: { value: string, label: string, className?: string, accentColor?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 sm:gap-5 pointer-events-auto ${className}`}>
      <span 
        className="text-[16px] sm:text-[22px] font-bold tracking-tight" 
        style={{ fontFamily: 'var(--font-mono, monospace)', textShadow: '0 4px 20px rgba(0,0,0,0.9)', color: accentColor }}
      >
        {value}
      </span>
      <span className="text-white/20 text-[18px] sm:text-[22px] font-mono leading-none hidden sm:inline">|</span>
      <span 
        className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] text-white/90 font-sans font-bold" 
        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}
      >
        {label}
      </span>
    </div>
  );
}

function FadeUp({ children, delay = 0, playKey = 0 }: { children: React.ReactNode, delay?: number, playKey?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (playKey > 0 && ref.current) {
      gsap.killTweensOf(ref.current);
      gsap.fromTo(ref.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1, delay: delay / 1000, ease: 'power3.out' }
      );
    }
  }, [playKey, delay]);

  return <div ref={ref} style={{ opacity: playKey > 0 ? 1 : 0 }}>{children}</div>;
}

export default function HeroSection() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Track replays based on entering the scroll window
  const [animKeys, setAnimKeys] = useState({
    phase0: 1,
    phase1: 0,
    phase2: 0,
    phase3: 0,
    phase4: 0,
    phase5: 0,
    phase6: 0,
    phase7: 0,
    phase8: 0,
    phase9: 0
  });

  const playedRefs = useRef({
    phase0: true, // starts visible
    phase1: false,
    phase2: false,
    phase3: false,
    phase4: false,
    phase5: false,
    phase6: false,
    phase7: false,
    phase8: false,
    phase9: false
  });

  const introRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subHeadlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const whoRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const philRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = scrollPercentage;
    let newKeys = { ...animKeys };
    let changed = false;

    const checkPhase = (phaseName: keyof typeof playedRefs.current, enterP: number) => {
      // Re-trigger animation if entering the window
      if (p >= enterP && !playedRefs.current[phaseName]) {
        playedRefs.current[phaseName] = true;
        newKeys[phaseName] += 1;
        changed = true;
      } else if (p < Math.max(0, enterP - 0.02) && playedRefs.current[phaseName]) {
        playedRefs.current[phaseName] = false;
      }
    };

    // ── HERO PHASES (0–30.1% of scroll ≈ 0–9.9s of video) ──
    // Original thresholds × 0.3011 to compress into first 30.1%
    checkPhase('phase1', 0.036);   // was 0.12
    checkPhase('phase2', 0.072);   // was 0.24
    checkPhase('phase3', 0.133);   // was 0.44
    checkPhase('phase4', 0.181);   // was 0.60
    checkPhase('phase5', 0.229);   // was 0.76

    // ── ABOUT PHASES (30.1–100% of scroll ≈ 9.9–33s of video) ──
    checkPhase('phase6', 0.301);
    checkPhase('phase7', 0.476);
    checkPhase('phase8', 0.651);
    checkPhase('phase9', 0.826);

    if (changed) {
      setAnimKeys(newKeys);
    }

    // ── Apply outer envelope fades ──
    // HERO phases — all getTransform values × 0.3011
    if (introRef.current) gsap.set(introRef.current, getTransform(p, -0.030, 0, 0.024, 0.036));
    if (eyebrowRef.current) gsap.set(eyebrowRef.current, getTransform(p, 0.036, 0.054, 0.060, 0.072));
    if (headlineRef.current) gsap.set(headlineRef.current, getTransform(p, 0.072, 0.096, 0.120, 0.133));
    if (subHeadlineRef.current) gsap.set(subHeadlineRef.current, getTransform(p, 0.133, 0.151, 0.169, 0.181));

    if (ctaRef.current) {
      const { opacity, y } = getTransform(p, 0.181, 0.199, 0.217, 0.229);
      gsap.set(ctaRef.current, { opacity, y, pointerEvents: opacity > 0.1 ? 'auto' : 'none' });
    }

    if (hudRef.current) gsap.set(hudRef.current, getTransform(p, 0.229, 0.247, 0.275, 0.301));

    // ABOUT phases
    if (whoRef.current) gsap.set(whoRef.current, getTransform(p, 0.301, 0.33, 0.41, 0.44));
    if (workRef.current) gsap.set(workRef.current, getTransform(p, 0.476, 0.51, 0.57, 0.60));
    if (philRef.current) gsap.set(philRef.current, getTransform(p, 0.651, 0.68, 0.75, 0.78));
    if (closeRef.current) gsap.set(closeRef.current, getTransform(p, 0.826, 0.86, null, null));

  }, [scrollPercentage, animKeys]);

  return (
    <div className="relative w-full" style={{ height: '830vh', background: '#0d0f12' }}>

      {/* Target canvas/video to be right-weighted to fix framing issues where subject overlaps text */}
      <div className="absolute inset-0 [&_canvas]:!object-cover [&_canvas]:!object-[75%_center] sm:[&_canvas]:!object-[right_center] [&_video]:!object-cover [&_video]:!object-[75%_center] sm:[&_video]:!object-[right_center]">
        <ScrollyVideo
          src="/videos/full_site_intro_sequence.mp4"
          useWebCodecs={true}
          cover={true}
          sticky={true}
          full={true}
          trackScroll={true}
          transitionSpeed={12}
          onChange={(percentage: number) => setScrollPercentage(percentage)}
        />
      </div>

      {/* Overlay Container */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">

          {/* Extended Gradient Backdrop for text legibility */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(13,15,18,0.75) 0%, rgba(13,15,18,0.4) 45%, rgba(13,15,18,0) 75%)',
            }}
          />

          {/* SINGLE FIXED-WIDTH COLUMN PINNED LEFT */}
          <div className="absolute top-0 left-0 h-full w-full max-w-xl px-8 sm:px-12 flex flex-col justify-center z-20 pointer-events-none">

            <div className="relative w-full h-[300px]">

              {/* PHASE 0: Initial Resume Info */}
              <div ref={introRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                <h1 className="flex flex-wrap items-center gap-4 text-5xl sm:text-7xl font-bold tracking-tighter mb-4" style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)', textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                  <SplitText
                    key={`p0-1-${animKeys.phase0}`}
                    text="BINORE"
                    delay={40}
                    duration={1.2}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40, scale: 0.9 }}
                    to={{ opacity: 1, y: 0, scale: 1 }}
                    tag="span"
                    className="text-white"
                  />
                  <SplitText
                    key={`p0-2-${animKeys.phase0}`}
                    text="MOHAPATRA"
                    delay={40}
                    duration={1.2}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40, scale: 0.9 }}
                    to={{ opacity: 1, y: 0, scale: 1 }}
                    tag="span"
                    className="text-[#d97757]"
                  />
                </h1>
                {animKeys.phase0 > 0 && (
                  <>
                    <BlurText
                      text="Full-Stack Developer Intern"
                      delay={100}
                      animateBy="words"
                      direction="top"
                      className="text-xl sm:text-2xl text-white font-sans font-medium mb-6 drop-shadow-md"
                    />
                    <div className="font-mono text-sm leading-relaxed max-w-lg uppercase tracking-wider text-white font-semibold drop-shadow-md min-h-[48px] sm:min-h-[40px]">
                      <TextType
                        text="API Development ✦ Cloud Deployment ✦ React ✦ Node.js ✦ Spring Boot"
                        typingSpeed={40}
                        cursorCharacter="|"
                        cursorClassName="text-[#2dd4bf]"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* PHASE 1: Eyebrow */}
              <div ref={eyebrowRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                {animKeys.phase1 > 0 && (
                  <BlurText
                    key={`p1-${animKeys.phase1}`}
                    text="Open to opportunities"
                    delay={30}
                    animateBy="words"
                    direction="top"
                    className="tracking-[0.22em] text-sm font-bold text-[#d97757] uppercase font-mono"
                  />
                )}
              </div>

              {/* PHASE 2: Headline */}
              <div ref={headlineRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                <div
                  className="leading-[1.05] tracking-tighter"
                  style={{
                    fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                    fontSize: 'clamp(48px, 7vw, 84px)',
                    color: '#ffffff',
                    fontWeight: 800,
                    textShadow: '0 4px 24px rgba(0,0,0,0.6)'
                  }}
                >
                  {animKeys.phase2 > 0 && (
                    <SplitText
                      key={`p2-${animKeys.phase2}`}
                      text="Building Systems That Ship."
                      delay={40}
                      duration={1.2}
                      ease="power3.out"
                      splitType="chars"
                      from={{ opacity: 0, y: 30 }}
                      to={{ opacity: 1, y: 0 }}
                      tag="h1"
                      textAlign="left"
                    />
                  )}
                </div>
              </div>

              {/* PHASE 3: Sub-headline */}
              <div ref={subHeadlineRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                {animKeys.phase3 > 0 && (
                  <div style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
                    <BlurText
                      key={`p3-${animKeys.phase3}`}
                      text="Full-stack developer currently building production systems at two internships simultaneously — from AI-powered advisory tools to real-time research collaboration platforms. Comfortable end-to-end: React, Next.js, Node.js and Spring Boot, shipped and deployed."
                      delay={30}
                      animateBy="words"
                      direction="bottom"
                      className="max-w-lg leading-relaxed text-[#d1d5db] font-sans font-medium"
                    />
                  </div>
                )}
              </div>

              {/* PHASE 4: CTA Buttons */}
              <div ref={ctaRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                <div className="flex flex-wrap items-center gap-6">
                  <FadeUp playKey={animKeys.phase4} delay={0}>
                    <a
                      href="#projects"
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-[#0d0f12] rounded-md overflow-hidden transition-transform hover:-translate-y-0.5"
                      style={{ fontFamily: 'var(--font-mono, monospace)' }}
                    >
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">View My Work</span>
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#d97757] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </a>
                  </FadeUp>
                  <FadeUp playKey={animKeys.phase4} delay={100}>
                    <a
                      href="#connect"
                      className="group relative inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-[#ffffff] bg-transparent transition-all"
                      style={{ fontFamily: 'var(--font-mono, monospace)' }}
                    >
                      Get in Touch
                      <div className="absolute bottom-2 left-6 right-6 h-[2px] bg-[#ffffff] opacity-30 group-hover:bg-[#2dd4bf] group-hover:opacity-100 transition-all duration-300" />
                    </a>
                  </FadeUp>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════ */}
              {/* ABOUT PHASES (30.1–100% of scroll ≈ 9.9–33s of video)      */}
              {/* ════════════════════════════════════════════════════════════ */}

              {/* PHASE 6: WHO I AM */}
              <div ref={whoRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                <p
                  className="text-[12px] uppercase tracking-[0.3em] font-bold text-[#d97757] mb-3"
                  style={{ fontFamily: 'var(--font-mono, monospace)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                >
                  WHO I AM
                </p>
                <div
                  className="leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: 'var(--font-sans, "Inter", sans-serif)',
                    fontSize: 'clamp(32px, 5vw, 56px)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textShadow: '0 4px 24px rgba(0,0,0,0.6)'
                  }}
                >
                  {animKeys.phase6 > 0 && (
                    <SplitText
                      key={`p6-${animKeys.phase6}`}
                      text="I am a Full-Stack Developer."
                      delay={30}
                      duration={1.0}
                      ease="power3.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                    />
                  )}
                </div>
              </div>

              {/* PHASE 7: CURRENT WORK */}
              <div ref={workRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                <p
                  className="text-[12px] uppercase tracking-[0.3em] font-bold text-[#2dd4bf] mb-3"
                  style={{ fontFamily: 'var(--font-mono, monospace)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                >
                  CURRENT WORK
                </p>
                <div
                  className="leading-[1.15] tracking-tight"
                  style={{
                    fontFamily: 'var(--font-sans, "Inter", sans-serif)',
                    fontSize: 'clamp(28px, 4.5vw, 48px)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textShadow: '0 4px 24px rgba(0,0,0,0.6)'
                  }}
                >
                  {animKeys.phase7 > 0 && (
                    <SplitText
                      key={`p7-${animKeys.phase7}`}
                      text="Interning simultaneously at OM Associates & Suvidha Mahila Mandal."
                      delay={30}
                      duration={1.0}
                      ease="power3.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                    />
                  )}
                </div>
              </div>

              {/* PHASE 8: PHILOSOPHY */}
              <div ref={philRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                <p
                  className="text-[12px] uppercase tracking-[0.3em] font-bold text-[#d97757] mb-3"
                  style={{ fontFamily: 'var(--font-mono, monospace)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                >
                  PHILOSOPHY
                </p>
                <div
                  className="leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: 'var(--font-sans, "Inter", sans-serif)',
                    fontSize: 'clamp(32px, 5vw, 56px)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textShadow: '0 4px 24px rgba(0,0,0,0.6)'
                  }}
                >
                  {animKeys.phase8 > 0 && (
                    <SplitText
                      key={`p8-${animKeys.phase8}`}
                      text="Full-stack systems, built to actually ship."
                      delay={30}
                      duration={1.0}
                      ease="power3.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                    />
                  )}
                </div>
              </div>

              {/* PHASE 9: CLOSING / TRANSITION */}
              <div ref={closeRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
                <div
                  className="leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: 'var(--font-sans, "Inter", sans-serif)',
                    fontSize: 'clamp(32px, 5vw, 56px)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textShadow: '0 4px 24px rgba(0,0,0,0.6)'
                  }}
                >
                  {animKeys.phase9 > 0 && (
                    <SplitText
                      key={`p9-${animKeys.phase9}`}
                      text="Here's what that looks like in practice."
                      delay={30}
                      duration={1.0}
                      ease="power3.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                    />
                  )}
                </div>
                <div className="w-16 h-px bg-white/40 mt-6" />
              </div>

            </div>
          </div>

          {/* Phase 5 HUD Cards: Redistributed left and right, moved higher up to avoid torso overlap */}
          <div ref={hudRef} className="absolute top-1/2 -translate-y-1/2 left-6 right-6 sm:left-12 sm:right-12 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 pointer-events-none">
            
            {/* Left Stats Column */}
            <div className="flex flex-col items-start gap-4">
              <FadeUp playKey={animKeys.phase5} delay={0}>
                <HeroStatText
                  value="10+ Projects Shipped"
                  label="All documented on GitHub"
                  className="justify-start"
                  accentColor="#2dd4bf"
                />
              </FadeUp>
              <FadeUp playKey={animKeys.phase5} delay={40}>
                <HeroStatText
                  value="8.07 CGPA"
                  label="B.Tech CSE, GGSIPU Delhi"
                  className="justify-start"
                  accentColor="#2dd4bf"
                />
              </FadeUp>
            </div>

            {/* Right Stats Column */}
            <div className="flex flex-col items-start sm:items-end gap-5">
              <FadeUp playKey={animKeys.phase5} delay={80}>
                <HeroStatText
                  value="Class of '28 · B.Tech CSE"
                  label="Expected Graduation"
                  className="justify-start sm:justify-end"
                  accentColor="#d97757"
                />
              </FadeUp>
              <FadeUp playKey={animKeys.phase5} delay={160}>
                <HeroStatText
                  value="2 Live Internships"
                  label="OM Associates • Suvidha Mahila Mandal"
                  className="justify-start sm:justify-end"
                  accentColor="#3b82f6"
                />
              </FadeUp>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
