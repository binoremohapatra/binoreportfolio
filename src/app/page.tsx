import HeroSection from '@/components/HeroSection';
import LogoLoop from '@/components/ui/reactbits/LogoLoop';
import ExperienceConnector from '@/components/ExperienceConnector';
import ProjectsOrbit from '@/components/ProjectsOrbit';
import ConnectSection from '@/components/ConnectSection';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiSpringboot,
  SiPostgresql,
  SiDocker,
  SiFlutter,
  SiVercel,
} from 'react-icons/si';

const techLogos = [
  { node: <SiReact />,      title: 'React',        href: 'https://react.dev' },
  { node: <SiNextdotjs />,  title: 'Next.js',      href: 'https://nextjs.org' },
  { node: <SiTypescript />, title: 'TypeScript',   href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />,title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiNodedotjs />,  title: 'Node.js',      href: 'https://nodejs.org' },
  { node: <SiSpringboot />, title: 'Spring Boot',  href: 'https://spring.io/projects/spring-boot' },
  { node: <SiPostgresql />, title: 'PostgreSQL',   href: 'https://www.postgresql.org' },
  { node: <SiDocker />,     title: 'Docker',       href: 'https://www.docker.com' },
  { node: <SiFlutter />,    title: 'Flutter',      href: 'https://flutter.dev' },
  { node: <SiVercel />,     title: 'Vercel',       href: 'https://vercel.com' },
];

function FixedGrain() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none mix-blend-overlay opacity-[0.06]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0f12]">
      <FixedGrain />
      <HeroSection />

      {/* Skills Showcase Section */}
      <section className="pt-20 sm:pt-32 pb-16 sm:pb-24 overflow-hidden relative z-20 bg-[#a8adac]">

        {/* Top Bridge Gradient (Hero -> Core Stack) */}
        <div
          className="absolute top-0 left-0 right-0 h-[200px] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #181a1b 0%, #646868 40%, transparent 100%)' }}
        />

        {/* Top Corners Vignette Polish */}
        {/* Top Corners Vignette Polish */}
        <div
          className="absolute top-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[300px] pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(ellipse at top left, #181a1b 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[300px] pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(ellipse at top right, #181a1b 0%, transparent 70%)' }}
        />



        <div className="relative z-10 mb-16 text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-gray-900 tracking-[0.15em] sm:tracking-[0.2em] uppercase">Core Stack</h2>
          <div className="w-24 h-1 bg-[#d97757] mx-auto mt-6 rounded-full" />
        </div>

        {/* LogoLoop Marquee — tech brand icons */}
        <div
          style={{
            // All icons render as monochrome dark silhouettes at rest;
            // hover state transitions them to the orange accent via .logoloop__item:hover svg
            color: '#181a1b',
          }}
        >
          <LogoLoop
            logos={techLogos}
            speed={90}
            direction="left"
            logoHeight={40}
            gap={56}
            fadeOut
            fadeOutColor="#a8adac"
            showLabels
            ariaLabel="Core tech stack"
          />
        </div>
      </section>

      {/* Experience Connector Path */}
      <ExperienceConnector />

      {/* Projects Orbital Showcase */}
      <ProjectsOrbit />

      {/* Connect / Contact — final section */}
      <ConnectSection />
    </main>
  );
}
