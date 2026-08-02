import HeroSection from '@/components/HeroSection';
import ScrollVelocity from '@/components/ui/reactbits/ScrollVelocity';
import ExperienceConnector from '@/components/ExperienceConnector';
import ProjectsOrbit from '@/components/ProjectsOrbit';
import ConnectSection from '@/components/ConnectSection';

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

        <div className="flex flex-col gap-6">
          <ScrollVelocity
            texts={[
              'React ✦ Next.js ✦ TypeScript ✦ Tailwind CSS ✦ Framer Motion ✦',
              'Node.js ✦ Express.js ✦ Spring Boot ✦ PostgreSQL ✦ Docker ✦'
            ]}
            velocity={60}
            className="text-gray-900 hover:text-black transition-colors cursor-default drop-shadow-sm"
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
