'use client';

/**
 * ConnectSection — "LET'S CONNECT" contact section
 *
 * Scroll-scrubbed video background (hands-connect-final2.mp4) via the same
 * scrolly-video pattern as HeroSection. As the user scrolls, the hands
 * approach their connection point — timed so the social links become fully
 * visible exactly at the "near-touch / glow-peak" moment.
 *
 * Text and links use the same windowOpacity enter→hold envelope from Hero.
 * Links are GitHub, WhatsApp, LinkedIn — update the placeholder URLs below.
 *
 * Layout:
 * ┌──────────────────────────────────────────────────────┐
 * │  [CONNECT label + underline]  ← upper-left quadrant  │
 * │                                                       │
 * │  "Let's build something."     ← large headline       │
 * │                                                       │
 * │           [hands video fills bg]                     │
 * │                                                       │
 * │  GitHub  ·  WhatsApp  ·  LinkedIn  ← lower-center    │
 * │                                                       │
 * │  © 2025 Binore Mohapatra        ← footer line        │
 * └──────────────────────────────────────────────────────┘
 */

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle } from 'lucide-react';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { useDeviceTier } from '@/hooks/useDeviceTier';

gsap.registerPlugin(ScrollTrigger);

// ─── Brand-accurate inline SVG icons (lucide-react v1.28 removed Github/Linkedin) ──
function GitHubIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import SplitText from '@/components/ui/reactbits/SplitText';
import BlurText from '@/components/ui/reactbits/BlurText';

// ─── PLACEHOLDER URLS — find-and-replace these ────────────────────────────────
const SOCIAL_LINKS = {
  github: 'https://github.com/binoremohapatra',
  whatsapp: 'https://wa.me/918368027842?text=Hi%2C%20I%20saw%20your%20portfolio!',
  linkedin: 'https://www.linkedin.com/in/binoremohapatra/',
};

// ─── Same helpers from Hero ────────────────────────────────────────────────────
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

// ─── FadeUp — identical to Hero's implementation ──────────────────────────────
function FadeUp({
  children,
  delay = 0,
  playKey = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  playKey?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (playKey > 0 && ref.current) {
      gsap.killTweensOf(ref.current);
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, delay: delay / 1000, ease: 'power3.out' }
      );
    }
  }, [playKey, delay]);
  return (
    <div ref={ref} style={{ opacity: playKey > 0 ? 1 : 0 }}>
      {children}
    </div>
  );
}

// ─── WhatsApp icon (brand-accurate, inline SVG) ───────────────────────────────
function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Social link component ────────────────────────────────────────────────────
function SocialLink({
  href,
  icon,
  label,
  delay,
  playKey,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  delay: number;
  playKey: number;
}) {
  return (
    <FadeUp delay={delay} playKey={playKey}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 cursor-pointer select-none"
        aria-label={label}
      >
        {/* Icon */}
        <span
          className="text-white/50 transition-colors duration-300 group-hover:text-[#d97757]"
          style={{ filter: 'drop-shadow(0 0 0px transparent)', transition: 'color 0.3s, filter 0.3s' }}
        >
          {/* On hover, icon glows orange — driven by group-hover via CSS */}
          <span className="group-hover:[filter:drop-shadow(0_0_8px_rgba(217,119,87,0.7))] transition-[filter] duration-300 block">
            {icon}
          </span>
        </span>

        {/* Label */}
        <span
          className="text-[11px] uppercase tracking-[0.25em] font-bold text-white/40 group-hover:text-[#d97757] transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}
        >
          {label}
        </span>

        {/* Underline hint — orange, scales in on hover */}
        <div className="hidden sm:block h-px w-0 bg-[#d97757] group-hover:w-full transition-all duration-300 origin-left opacity-60 mt-1 self-end" />
      </a>
    </FadeUp>
  );
}

// ─── LOW tier fallback: simple static layout, IntersectionObserver-driven ─────
function LowTierConnectSection({ SOCIAL_LINKS }: { animKeys: any, setAnimKeys: any, SOCIAL_LINKS: Record<string, string> }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="connect"
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center gap-12 px-8 py-24"
      style={{ background: 'linear-gradient(to bottom, #0d0f12, #111315)' }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #d97757, transparent)' }} />

      {/* Headline */}
      <div
        className="text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '0.1s' }}
      >
        <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#d97757] mb-4" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
          Let&apos;s Connect
        </p>
        <h2
          className="font-bold text-white"
          style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 'clamp(32px, 8vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
        >
          Let&apos;s build something.
        </h2>
        <p className="mt-4 text-sm text-white/50 font-mono">Open to full-time roles, internships, and freelance projects.</p>
      </div>

      {/* Social links */}
      <div
        className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '0.3s' }}
      >
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-[#d97757] transition-colors">
          <GitHubIcon size={22} />
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold font-mono">GitHub</span>
        </a>
        <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-[#d97757] transition-colors">
          <WhatsAppIcon size={22} />
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold font-mono">WhatsApp</span>
        </a>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-[#d97757] transition-colors">
          <LinkedInIcon size={22} />
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold font-mono">LinkedIn</span>
        </a>
      </div>

      {/* Footer */}
      <p
        className="text-[10px] uppercase tracking-[0.25em] text-white/20 transition-all duration-700"
        style={{ fontFamily: 'var(--font-mono, monospace)', opacity: visible ? 1 : 0, transitionDelay: '0.5s' }}
      >
        © {new Date().getFullYear()} Binore Mohapatra &nbsp;·&nbsp; Designed &amp; Built by hand
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ConnectSection() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { tier } = useDeviceTier();

  // Phase keys — same pattern as Hero (re-triggers animation on entering window)
  const [animKeys, setAnimKeys] = useState({
    label: 0,
    headline: 0,
    sub: 0,
    links: 0,
  });

  const playedRefs = useRef({
    label: false,
    headline: false,
    sub: false,
    links: false,
  });

  // Overlay element refs
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // LOW tier: no scroll dependency — will use IntersectionObserver instead
    if (tier === 'LOW') return;

    // 1. Setup video scrubbing and general scroll tracking
    const section = sectionRef.current;
    
    if (section) {
      // Create a timeline for tracking scroll progress
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          // Provide the scroll percentage to the rest of the component
          setScrollPercentage(self.progress);
          
          if (tier === 'HIGH') {
            // Scrub the video directly safely to prevent main-thread lockups
            const video = videoRef.current;
            if (video && video.duration && video.readyState >= 2) {
              // Only seek if the video is not currently busy seeking, otherwise decoder hangs
              if (!video.seeking) {
                requestAnimationFrame(() => {
                  video.currentTime = self.progress * video.duration;
                });
              }
            }
          }
        }
      });

      // Cleanup
      return () => {
        st.kill();
      };
    }
  }, [tier]);

  useEffect(() => {
    // 2. Handle text/opacity animations based on scrollPercentage
    const p = scrollPercentage;
    let newKeys = { ...animKeys };
    let changed = false;

    const checkPhase = (phaseName: keyof typeof playedRefs.current, enterP: number) => {
      if (p >= enterP && !playedRefs.current[phaseName]) {
        playedRefs.current[phaseName] = true;
        newKeys[phaseName] += 1;
        changed = true;
      } else if (p < Math.max(0, enterP - 0.05) && playedRefs.current[phaseName]) {
        playedRefs.current[phaseName] = false;
      }
    };

    checkPhase('label', 0.05);
    checkPhase('headline', 0.18);
    checkPhase('sub', 0.35);
    checkPhase('links', 0.62); // links appear at ~"near-touch" moment in video

    if (changed) setAnimKeys(newKeys);

    // Outer envelope fades — windowOpacity gives enter→hold, no exit (last section)
    if (labelRef.current) {
      gsap.set(labelRef.current, {
        opacity: windowOpacity(p, 0.05, 0.14, null, null),
      });
    }
    if (headlineRef.current) {
      gsap.set(headlineRef.current, {
        opacity: windowOpacity(p, 0.18, 0.28, null, null),
      });
    }
    if (subRef.current) {
      gsap.set(subRef.current, {
        opacity: windowOpacity(p, 0.35, 0.46, null, null),
      });
    }
    if (linksRef.current) {
      gsap.set(linksRef.current, {
        opacity: windowOpacity(p, 0.62, 0.72, null, null),
      });
    }
    if (footerRef.current) {
      gsap.set(footerRef.current, {
        opacity: windowOpacity(p, 0.80, 0.90, null, null),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPercentage]);

  // ── LOW tier: simple static section with IntersectionObserver-based reveal ──
  if (tier === 'LOW') {
    return (
      <LowTierConnectSection
        animKeys={animKeys}
        setAnimKeys={setAnimKeys}
        SOCIAL_LINKS={SOCIAL_LINKS}
      />
    );
  }

  return (
    <div
      id="connect"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '200vh', background: '#0d0f12' }}
    >
      {/* ── Top seam gradient + Certificates Marquee ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[180px] z-[5] overflow-hidden flex flex-col justify-center"
        style={{ background: 'linear-gradient(to bottom, #a8adac 0%, #646868 35%, #0d0f12 100%)' }}
      >
        <p className="text-center text-white/50 text-[10px] tracking-[0.3em] font-mono uppercase mb-4">
          Certifications & Accolades
        </p>
        
        {/* Infinite CSS Marquee */}
        <div className="relative w-full flex overflow-hidden group">
          <style>{`
            @keyframes scroll-left {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: scroll-left 30s linear infinite;
            }
            .group:hover .animate-marquee {
              animation-play-state: paused;
            }
          `}</style>

          <div className="animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 sm:gap-8 px-3 sm:px-4">
                {[
                  'Java DSA Master | Scaler Topics',
                  'Full-Stack Web Dev | Unified Mentor',
                  'AR Lens Development | Snap AR',
                  'Data Science Workshop | DUCAT',
                ].map((cert, j) => {
                  const [title, provider] = cert.split(' | ');
                  return (
                    <div
                      key={`${i}-${j}`}
                      className="group/cert relative flex flex-col justify-center px-6 py-4 min-w-[280px] rounded-2xl bg-[#111315] border border-white/10 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#181a1d] hover:border-white/20 hover:shadow-[0_15px_40px_rgba(45,212,191,0.15)] cursor-default overflow-hidden"
                    >
                      {/* Subtle gradient glow behind the text */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover/cert:opacity-100 transition-opacity duration-500" />
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/cert:bg-teal-500/20 group-hover/cert:border-teal-500/30 transition-colors duration-300 shadow-inner">
                          <div className="w-2 h-2 rounded-full bg-teal-400 group-hover/cert:animate-pulse group-hover/cert:shadow-[0_0_10px_2px_rgba(45,212,191,0.6)]" />
                        </div>
                        
                        <div className="flex flex-col gap-0.5">
                          <EncryptedText
                            text={title}
                            revealDelayMs={30}
                            flipDelayMs={30}
                            encryptedClassName="text-teal-400/80 font-mono text-sm"
                            revealedClassName="text-white font-sans font-bold tracking-tight text-[15px] sm:text-[16px] group-hover/cert:text-teal-300 transition-colors duration-300"
                          />
                          <span className="text-white/40 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em]">
                            {provider}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Background Video Container ── */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          {tier === 'HIGH' ? (
            <video
              ref={videoRef}
              src="/videos/hands-connect-final2.mp4"
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="auto"
            />
          ) : tier === 'MEDIUM' ? (
            <video
              src="/videos/hands-connect-final2.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <video
              src="/videos/hands-connect-final2.mp4#t=5"
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          )}
        </div>
      </div>

      {/* ── Mobile Fallback: CSS Glowing Connection Point ── */}
      <div className="absolute inset-0 z-0 pointer-events-none sm:hidden flex items-center justify-center">
        <div className="sticky top-0 w-full h-screen flex items-center justify-center">
          <div className="relative w-4 h-4 rounded-full bg-[#d97757] animate-pulse shadow-[0_0_40px_10px_rgba(217,119,87,0.6)]">
            <div className="absolute inset-0 rounded-full border border-[#d97757] animate-ping opacity-50" />
          </div>
        </div>
      </div>

      {/* ── Overlay + content — sticky viewport ── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">

          {/* Gradient darkening for text legibility (left-side focus) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(13,15,18,0.85) 0%, rgba(13,15,18,0.55) 50%, rgba(13,15,18,0.15) 100%), linear-gradient(to top, rgba(13,15,18,0.7) 0%, transparent 50%)',
            }}
          />

          {/* ── SECTION LABEL ── upper-left */}
          <div
            ref={labelRef}
            className="absolute top-16 left-8 sm:left-14 opacity-0 pointer-events-none"
          >
            <p
              className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#d97757]"
              style={{ fontFamily: 'var(--font-mono, monospace)', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
            >
              Let&apos;s Connect
            </p>
            <div className="w-16 h-px bg-[#d97757] mt-2 opacity-80" />
          </div>

          {/* ── HEADLINE ── upper-left, large */}
          <div
            ref={headlineRef}
            className="absolute top-[28%] left-8 sm:left-14 max-w-xl opacity-0 pointer-events-auto"
          >
            <div
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: 'clamp(36px, 5.5vw, 72px)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                textShadow: '0 4px 24px rgba(0,0,0,0.7)',
              }}
            >
              {animKeys.headline > 0 && (
                <SplitText
                  key={`headline-${animKeys.headline}`}
                  text="Let's build something."
                  delay={40}
                  duration={1.1}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  tag="h2"
                  textAlign="left"
                />
              )}
            </div>
          </div>

          {/* ── SUB-TEXT ── */}
          <div
            ref={subRef}
            className="absolute top-[52%] left-8 sm:left-14 max-w-sm opacity-0 pointer-events-none"
          >
            {animKeys.sub > 0 && (
              <BlurText
                key={`sub-${animKeys.sub}`}
                text="Open to full-time roles, internships, and freelance projects."
                delay={25}
                animateBy="words"
                direction="bottom"
                className="text-sm sm:text-base leading-relaxed text-white/70 font-mono"
              />
            )}
          </div>

          {/* ── SOCIAL LINKS ── lower-center, reveal at ~62% (video "near-touch" moment) */}
          <div
            ref={linksRef}
            className="absolute bottom-20 sm:bottom-16 left-0 right-0 flex justify-center opacity-0 pointer-events-auto"
          >
            {/* Thin separator */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-px h-4 bg-white/20" />

            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14">
              <SocialLink
                href={SOCIAL_LINKS.github}
                icon={<GitHubIcon size={22} />}
                label="GitHub"
                delay={0}
                playKey={animKeys.links}
              />

              {/* Dot divider — desktop only */}
              <span className="hidden sm:block w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />

              <SocialLink
                href={SOCIAL_LINKS.whatsapp}
                icon={<WhatsAppIcon size={22} />}
                label="WhatsApp"
                delay={90}
                playKey={animKeys.links}
              />

              <span className="hidden sm:block w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />

              <SocialLink
                href={SOCIAL_LINKS.linkedin}
                icon={<LinkedInIcon size={22} />}
                label="LinkedIn"
                delay={180}
                playKey={animKeys.links}
              />
            </div>
          </div>

          {/* ── FOOTER ── absolute bottom */}
          <div
            ref={footerRef}
            className="absolute bottom-5 left-0 right-0 flex justify-center opacity-0 pointer-events-none"
          >
            <p
              className="text-[10px] uppercase tracking-[0.25em] text-white/20"
              style={{ fontFamily: 'var(--font-mono, monospace)' }}
            >
              © {new Date().getFullYear()} Binore Mohapatra &nbsp;·&nbsp; Designed &amp; Built by hand
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
