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
  SiPython,
  SiGooglegemini,
  SiAnthropic,
  SiOllama,
} from 'react-icons/si';

// OpenAI doesn't have a Simple Icons entry in this react-icons version, use inline SVG
function OpenAIIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.73 19.95a4.5 4.5 0 0 1-6.13-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  );
}

const techLogos = [
  { node: <SiReact />,        title: 'React',        href: 'https://react.dev' },
  { node: <SiNextdotjs />,    title: 'Next.js',      href: 'https://nextjs.org' },
  { node: <SiTypescript />,   title: 'TypeScript',   href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />,  title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiNodedotjs />,    title: 'Node.js',      href: 'https://nodejs.org' },
  { node: <SiSpringboot />,   title: 'Spring Boot',  href: 'https://spring.io/projects/spring-boot' },
  { node: <SiPostgresql />,   title: 'PostgreSQL',   href: 'https://www.postgresql.org' },
  { node: <SiDocker />,       title: 'Docker',       href: 'https://www.docker.com' },
  { node: <SiFlutter />,      title: 'Flutter',      href: 'https://flutter.dev' },
  { node: <SiVercel />,       title: 'Vercel',       href: 'https://vercel.com' },
  { node: <SiPython />,       title: 'Python',       href: 'https://www.python.org' },
  { node: <SiOllama />,       title: 'Ollama',       href: 'https://ollama.com' },
  { node: <SiGooglegemini />, title: 'Gemini',       href: 'https://deepmind.google/technologies/gemini' },
  { node: <OpenAIIcon />,     title: 'OpenAI',       href: 'https://openai.com' },
  { node: <SiAnthropic />,    title: 'Claude',       href: 'https://www.anthropic.com' },
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
