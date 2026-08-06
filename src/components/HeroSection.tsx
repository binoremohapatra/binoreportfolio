'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import BlurText from '@/components/ui/reactbits/BlurText';
import ScrollReveal from '@/components/ui/reactbits/ScrollReveal';
import SplitText from '@/components/ui/reactbits/SplitText';
import ShinyText from '@/components/ui/reactbits/ShinyText';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { CountUp } from '@/components/ui/CountUp';
import { preloadFrames, useScrollVideoScrub } from '@/hooks/useScrollVideoScrub';
import { useAdaptiveQuality } from '@/hooks/useAdaptiveQuality';
import { useLenisInstance } from '@/providers/LenisProvider';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

function HeroStatText({ value, label, playKey, delay = 0, className = "", accentColor = "white" }: { value: string, label: string, playKey: number, delay?: number, className?: string, accentColor?: string }) {
  // If the value contains a number (like "10+" or "8.07"), we can optionally extract it for CountUp.
  // For simplicity, we'll just render it as is, or we can use a custom renderer if it's purely a number.
  // We'll update the usages to pass the raw number to CountUp directly in the JSX.
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-3xl sm:text-4xl font-black tracking-tighter" style={{ color: accentColor, fontFamily: 'Technor, sans-serif' }}>
        {value}
      </span>
      <span className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] text-white/90 font-sans font-bold" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lenis = useLenisInstance();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.5 });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { tier, useWebCodecs, isReady } = useAdaptiveQuality();
  const [bitmaps, setBitmaps] = useState<(ImageBitmap | null)[]>([]);

  useEffect(() => {
    const checkFrames = () => {
      if (typeof window !== 'undefined' && window.__heroFrames && window.__heroFrames.length > 0) {
        setBitmaps(window.__heroFrames);
        return true;
      }
      return false;
    };

    if (!checkFrames()) {
      // Poll for the frames until the preloader attaches them to the window
      const interval = setInterval(() => {
        if (checkFrames()) {
          clearInterval(interval);
        }
      }, 100);

      // Fallback if it never happens after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!window.__heroFrames) {
          const frameCount = 300;
          const urls = Array.from({ length: frameCount }, (_, i) =>
            `/frames/hero/frame_${String(i + 1).padStart(4, '0')}.jpg`
          );
          preloadFrames(urls).then(setBitmaps);
        }
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, []);

  useScrollVideoScrub(canvasRef, bitmaps, sectionRef, {
    onUpdate: (progress) => setScrollPercentage(progress)
  });

  // Track replays based on entering the scroll window
  const [animKeys, setAnimKeys] = useState({
    phase1: 0,
    phase2: 0,
    phase3: 0,
    phase4: 0,
    phase5: 0,
    phase6: 0,
    phase7: 0,
    phase8: 0,
    phase9: 0,
    phase10: 0,
    phase11: 0,
    phase12: 0,
    phase13: 0
  });

  const playedRefs = useRef({
    phase1: false,
    phase2: false,
    phase3: false,
    phase4: false,
    phase5: false,
    phase6: false,
    phase7: false,
    phase8: false,
    phase9: false,
    phase10: false,
    phase11: false,
    phase12: false,
    phase13: false
  });

  const beatARef = useRef<HTMLDivElement>(null);
  const beatBRef = useRef<HTMLDivElement>(null);
  const beatCRef = useRef<HTMLDivElement>(null);
  const beatDRef = useRef<HTMLDivElement>(null);

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

    // BEAT A: Entrance
    checkPhase('phase1', 0.02);
    checkPhase('phase2', 0.05);
    checkPhase('phase3', 0.09);
    checkPhase('phase4', 0.13);

    // BEAT B: Direct Gaze
    checkPhase('phase5', 0.28);
    checkPhase('phase6', 0.33);
    checkPhase('phase7', 0.38);

    // BEAT C: Current Work
    checkPhase('phase8', 0.53);
    checkPhase('phase9', 0.57);
    checkPhase('phase10', 0.63);

    // BEAT D: Philosophy / Close
    checkPhase('phase11', 0.78);
    checkPhase('phase12', 0.82);
    checkPhase('phase13', 0.90);

    if (changed) {
      setAnimKeys(newKeys);
    }

    // ── Apply outer envelope fades ──
    if (beatARef.current) gsap.set(beatARef.current, getTransform(p, 0.02, 0.05, 0.23, 0.257));
    if (beatBRef.current) gsap.set(beatBRef.current, getTransform(p, 0.28, 0.33, 0.49, 0.514));
    if (beatCRef.current) gsap.set(beatCRef.current, getTransform(p, 0.53, 0.57, 0.75, 0.772));
    if (beatDRef.current) {
      const { opacity, y } = getTransform(p, 0.78, 0.82, null, null);
      gsap.set(beatDRef.current, { opacity, y, pointerEvents: opacity > 0.1 ? 'auto' : 'none' });
    }

  }, [scrollPercentage, animKeys, isReady]);

  // We removed the `!isReady` early return shell that was rendering plain HTML tags.
  // That fallback was causing the entire block to render completely statically on mount,
  // bypassing the animation libraries. We now conditionally load the ScrollyVideo below.

  return (
    <div ref={sectionRef} className="relative w-full" style={{ height: '830vh', background: '#0d0f12' }}>

      {/* ── Canvas Image Sequence Video ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="sticky top-0 w-full h-screen object-cover object-[75%_center] sm:object-[right_center]" />
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

              {/* BEAT A: Entrance */}
              <div ref={beatARef} className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0" style={{ fontFamily: 'Technor, sans-serif' }}>
                {animKeys.phase1 > 0 && (
                  <div className="mb-4">
                    <EncryptedText
                      key={`p1-${animKeys.phase1}`}
                      text="OPEN TO OPPORTUNITIES · 3RD YEAR B.TECH CSE"
                      className="tracking-[0.2em] text-[10px] sm:text-xs font-bold uppercase"
                      encryptedClassName="text-[#e0303d]/60"
                      revealedClassName="text-[#e0303d]"
                    />
                  </div>
                )}

                {animKeys.phase2 > 0 && (
                  <h1 className="flex flex-wrap items-center gap-3 sm:gap-4 font-bold tracking-tighter mb-4 text-[clamp(32px,10vw,72px)] leading-none" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                    <BlurText key={`p2a-${animKeys.phase2}`} text="BINORE" delay={40} animateBy="letters" direction="top" className="text-white" />
                    <FadeUp playKey={animKeys.phase2} delay={200}>
                      <ShinyText text="MOHAPATRA" speed={3} className="text-[#e0303d]" />
                    </FadeUp>
                  </h1>
                )}

                {animKeys.phase3 > 0 && (
                  <BlurText
                    key={`p3-${animKeys.phase3}`}
                    text="FULL-STACK DEVELOPER INTERN"
                    delay={40}
                    animateBy="words"
                    direction="top"
                    className="text-xl sm:text-2xl text-white font-bold mb-5 drop-shadow-md"
                  />
                )}

                {animKeys.phase4 > 0 && (
                  <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/80 font-bold drop-shadow-md min-h-[30px] overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                    <BlurText
                      key={`p4-${animKeys.phase4}`}
                      text="API DEVELOPMENT ✦ CLOUD DEPLOYMENT ✦ REACT ✦ NODE.JS ✦ SPRING BOOT"
                      delay={20}
                      animateBy="words"
                      direction="bottom"
                      className="whitespace-nowrap inline-block"
                    />
                  </div>
                )}
              </div>

              {/* BEAT B: Direct Gaze */}
              <div ref={beatBRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0" style={{ fontFamily: 'Technor, sans-serif' }}>
                {animKeys.phase5 > 0 && (
                  <div className="leading-[1.05] tracking-tighter text-white font-[800] text-[clamp(40px,6vw,72px)] mb-6" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                    <SplitText
                      key={`p5-${animKeys.phase5}`}
                      text="I don't clone tutorials. I architect production stacks."
                      delay={30}
                      duration={1.0}
                      ease="power3.out"
                      splitType="chars"
                      from={{ opacity: 0, y: 30 }}
                      to={{ opacity: 1, y: 0 }}
                    />
                  </div>
                )}

                {animKeys.phase6 > 0 && (
                  <div className="max-w-xl leading-relaxed text-[#d1d5db] font-bold text-[clamp(16px,1.8vw,20px)] mb-8">
                    <TextGenerateEffect
                      key={`p6-${animKeys.phase6}`}
                      words="Currently running production systems at two companies at once — React to Spring Boot, I build the whole thing."
                      duration={0.8}
                    />
                  </div>
                )}

                {animKeys.phase7 > 0 && (
                  <div className="flex flex-col gap-4 max-w-2xl">
                    <FadeUp playKey={animKeys.phase7} delay={0}>
                      <div className="flex flex-col">
                        <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#e0303d]" style={{ fontFamily: 'Technor, sans-serif' }}>
                          <CountUp to={10} className="inline-block" />+ Projects Shipped
                        </span>
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-white/50 uppercase mt-1" style={{ fontFamily: 'var(--font-mono, monospace)' }}>All documented on GitHub</span>
                      </div>
                    </FadeUp>
                    <FadeUp playKey={animKeys.phase7} delay={100}>
                      <div className="flex flex-col">
                        <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#e0303d]" style={{ fontFamily: 'Technor, sans-serif' }}>
                          <CountUp to={8} className="inline-block" />.07 CGPA
                        </span>
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-white/50 uppercase mt-1" style={{ fontFamily: 'var(--font-mono, monospace)' }}>B.Tech CSE, GGSIPU Delhi</span>
                      </div>
                    </FadeUp>
                    <FadeUp playKey={animKeys.phase7} delay={200}>
                      <div className="flex flex-col">
                        <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#e0303d]" style={{ fontFamily: 'Technor, sans-serif' }}>
                          <CountUp to={2} className="inline-block" /> Live Internships
                        </span>
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-white/50 uppercase mt-1" style={{ fontFamily: 'var(--font-mono, monospace)' }}>OM Associates · Suvidha Mahila Mandal</span>
                      </div>
                    </FadeUp>
                    <FadeUp playKey={animKeys.phase7} delay={300}>
                      <div className="flex flex-col">
                        <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#e0303d]" style={{ fontFamily: 'Technor, sans-serif' }}>
                          Class of <CountUp to={2028} className="inline-block" />
                        </span>
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-white/50 uppercase mt-1" style={{ fontFamily: 'var(--font-mono, monospace)' }}>Expected Graduation</span>
                      </div>
                    </FadeUp>
                  </div>
                )}
              </div>

              {/* BEAT C: Current Work / Tie-Adjust */}
              <div ref={beatCRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0" style={{ fontFamily: 'Technor, sans-serif' }}>
                {animKeys.phase8 > 0 && (
                  <div className="mb-4">
                    <EncryptedText
                      key={`p8-${animKeys.phase8}`}
                      text="CURRENT WORK"
                      className="tracking-[0.2em] text-[10px] sm:text-xs font-bold uppercase"
                      encryptedClassName="text-[#e0303d]/60"
                      revealedClassName="text-[#e0303d]"
                    />
                  </div>
                )}

                {animKeys.phase9 > 0 && (
                  <div className="leading-[1.05] tracking-tighter text-white font-[800] text-[clamp(32px,5vw,64px)] mb-6" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                    <SplitText
                      key={`p9-${animKeys.phase9}`}
                      text="Two simultaneous full-stack internships. Two live AI platforms. One engineer."
                      delay={20}
                      duration={1.0}
                      ease="power3.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                    />
                  </div>
                )}

                {animKeys.phase10 > 0 && (
                  <div className="max-w-xl leading-relaxed text-[#d1d5db] font-bold text-[clamp(15px,1.6vw,18px)]">
                    <TextGenerateEffect
                      key={`p10-${animKeys.phase10}`}
                      words="Building an AI tax advisory chatbot for OM Associates. Simultaneously architecting Research Connect — an enterprise-grade MERN research platform with real-time Socket.IO infrastructure — at Suvidha Foundation."
                      duration={0.8}
                    />
                  </div>
                )}
              </div>

              {/* BEAT D: Philosophy / Sunglasses / Close */}
              <div ref={beatDRef} className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0" style={{ fontFamily: 'Technor, sans-serif' }}>
                {animKeys.phase11 > 0 && (
                  <div className="mb-4">
                    <EncryptedText
                      key={`p11-${animKeys.phase11}`}
                      text="PHILOSOPHY"
                      className="tracking-[0.2em] text-[10px] sm:text-xs font-bold uppercase"
                      encryptedClassName="text-[#e0303d]/60"
                      revealedClassName="text-[#e0303d]"
                    />
                  </div>
                )}

                {animKeys.phase12 > 0 && (
                  <div className="leading-[1.05] tracking-tighter text-white font-[800] text-[clamp(40px,6vw,72px)] mb-6" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                    <SplitText
                      key={`p12-${animKeys.phase12}`}
                      text="I don't abandon repositories. I ship them to production."
                      delay={30}
                      duration={1.0}
                      ease="power3.out"
                      splitType="words"
                      from={{ opacity: 0, y: 30 }}
                      to={{ opacity: 1, y: 0 }}
                    />
                  </div>
                )}

                {animKeys.phase13 > 0 && (
                  <>
                    <div className="leading-relaxed text-white font-bold text-[clamp(18px,2vw,24px)] mb-8">
                      <SplitText
                        key={`p13-${animKeys.phase13}`}
                        text="Enough talk. Inspect the architecture."
                        delay={30}
                        duration={0.7}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 15 }}
                        to={{ opacity: 1, y: 0 }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pointer-events-auto">
                      <FadeUp playKey={animKeys.phase13} delay={0}>
                        <a
                          href="#projects"
                          onClick={(e) => handleScrollTo(e, '#projects')}
                          className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-[#0d0f12] rounded-md overflow-hidden transition-transform hover:-translate-y-0.5"
                          style={{ fontFamily: 'var(--font-mono, monospace)' }}
                        >
                          <span className="relative z-10 group-hover:text-white transition-colors duration-300">View My Work</span>
                          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#e0303d] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </a>
                      </FadeUp>
                      <FadeUp playKey={animKeys.phase13} delay={100}>
                        <a
                          href="#connect"
                          onClick={(e) => handleScrollTo(e, '#connect')}
                          className="group relative inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-white bg-transparent transition-all"
                          style={{ fontFamily: 'var(--font-mono, monospace)' }}
                        >
                          Get in Touch
                          <div className="absolute bottom-2 left-6 right-6 h-[2px] bg-white opacity-30 group-hover:bg-[#e0303d] group-hover:opacity-100 transition-all duration-300" />
                        </a>
                      </FadeUp>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
