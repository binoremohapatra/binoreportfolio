"use client";

import dynamic from "next/dynamic";

// Dynamic imports with SSR disabled – these components use window/DOM APIs
const TextPressure = dynamic(
  () => import("@/components/ui/reactbits/TextPressure"),
  { ssr: false }
);
const Shuffle = dynamic(
  () => import("@/components/ui/reactbits/Shuffle"),
  { ssr: false }
);
const BlurText = dynamic(
  () => import("@/components/ui/reactbits/BlurText"),
  { ssr: false }
);
const SplitText = dynamic(
  () => import("@/components/ui/reactbits/SplitText"),
  { ssr: false }
);
const ScrollFloat = dynamic(
  () => import("@/components/ui/reactbits/ScrollFloat"),
  { ssr: false }
);
const ScrollReveal = dynamic(
  () => import("@/components/ui/reactbits/ScrollReveal"),
  { ssr: false }
);
const CurvedLoop = dynamic(
  () => import("@/components/ui/reactbits/CurvedLoop"),
  { ssr: false }
);

export default function ReactBitsDemo() {
  return (
    <main
      style={{
        background: "#0d0f12",
        color: "#e8edf4",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        padding: "0 0 120px",
      }}
    >
      {/* ── Header */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#2dd4bf",
            display: "block",
            marginBottom: 16,
          }}
        >
          Component Library
        </span>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: 0,
            background: "linear-gradient(135deg, #ffffff 30%, #6b7280 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          React Bits Showcase
        </h1>
        <p style={{ color: "#6b7280", marginTop: 16, fontSize: 16 }}>
          All 6 components integrated and running live
        </p>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        {/* ── TextPressure */}
        <Section label="TextPressure" tag="Mouse-reactive variable font">
          <div style={{ position: "relative", height: 160, background: "rgba(255,255,255,0.03)", borderRadius: 16 }}>
            <TextPressure
              text="Move Me!"
              fontFamily="Roboto Flex"
              fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#2dd4bf"
              strokeColor="#d97757"
              minFontSize={32}
            />
          </div>
        </Section>

        {/* ── BlurText */}
        <Section label="BlurText" tag="Intersection Observer + framer-motion blur-in">
          <div style={{ padding: "40px 0" }}>
            <BlurText
              text="Blur text reveals as you scroll into view."
              delay={120}
              animateBy="words"
              direction="top"
              className="text-2xl font-semibold"
              stepDuration={0.45}
            />
          </div>
        </Section>

        {/* ── SplitText */}
        <Section label="SplitText" tag="GSAP SplitText + ScrollTrigger per-char animation">
          <div style={{ padding: "40px 0" }}>
            <SplitText
              text="Each character springs into place on scroll."
              delay={40}
              duration={0.9}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="center"
              tag="h2"
              className="text-3xl font-bold"
            />
          </div>
        </Section>

        {/* ── Shuffle */}
        <Section label="Shuffle" tag="GSAP strip-slide shuffle on scroll + hover">
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <Shuffle
              text="Shuffle Animation"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              style={{
                fontSize: "clamp(28px, 5vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#d97757",
                fontFamily: "var(--font-mono, monospace)",
              }}
            />
          </div>
        </Section>

        {/* ── ScrollFloat */}
        <Section label="ScrollFloat" tag="GSAP scrub – chars scale + rise on scroll">
          <div style={{ padding: "20px 0 60px" }}>
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              textClassName="text-white"
            >
              Float Up
            </ScrollFloat>
          </div>
        </Section>

        {/* ── ScrollReveal */}
        <Section label="ScrollReveal" tag="GSAP scrub – word-by-word opacity + blur reveal">
          <ScrollReveal
            enableBlur={true}
            baseOpacity={0}
            baseRotation={4}
            blurStrength={8}
            textClassName="text-[#e8edf4]"
          >
            When does a man truly live? Not when he breathes — but when he creates something the world remembers. Scroll to reveal the truth.
          </ScrollReveal>
        </Section>

        {/* ── CurvedLoop */}
        <Section label="CurvedLoop" tag="SVG textPath curved marquee – drag to reverse">
          <div style={{ margin: "20px -24px" }}>
            <CurvedLoop
              marqueeText="React Bits  ✦  TextPressure  ✦  BlurText  ✦  SplitText  ✦  Shuffle  ✦  ScrollFloat  ✦  ScrollReveal  ✦  CurvedLoop  ✦  "
              speed={2}
              curveAmount={350}
              direction="left"
              interactive={true}
              className="text-[22px] font-semibold fill-[#6b7280] hover:fill-[#2dd4bf] transition-colors"
            />
          </div>
        </Section>

      </div>
    </main>
  );
}

function Section({
  label,
  tag,
  children,
}: {
  label: string;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: 64,
        paddingBottom: 48,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#2dd4bf",
            background: "rgba(45,212,191,0.10)",
            padding: "3px 10px",
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          {label}
        </span>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{tag}</p>
      </div>
      {children}
    </section>
  );
}