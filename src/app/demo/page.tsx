import React from 'react';
import { ProjectCard } from '@/components/portfolio/cards/ProjectCard';
import { SkillCard } from '@/components/portfolio/cards/SkillCard';
import { Database, LayoutTemplate, Share2 } from 'lucide-react';

export default function CardsDemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e8edf4] p-8 sm:p-12 md:p-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-24">
        
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-mono text-white mb-2">COMPONENT 1: ProjectCard</h2>
            <p className="text-[#8b95a7]">Hover or focus to see the energizing copper trace, lift effect, and cyan glow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              title="SwiftRoute"
              description="High-performance logistics tracker with real-time ETA updates."
              stack={['Node.js', 'Socket.IO', 'Razorpay']}
              glyph={Share2}
              link="#"
              status="live"
            />
            
            <ProjectCard
              title="ReactorX"
              description="E-commerce core with distributed inventory management."
              stack={['Next.js', 'Tailwind', 'Stripe']}
              glyph={LayoutTemplate}
              link="#"
            />
            
            <ProjectCard
              title="Maeve AI"
              description="Context-aware natural language assistant for enterprise."
              stack={['React', 'Python', 'LLM API']}
              glyph={Database}
              link="#"
              status="live"
            />
          </div>
        </section>

        <hr className="border-[#1e2636]" />

        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-mono text-white mb-2">COMPONENT 2: SkillCard</h2>
            <p className="text-[#8b95a7]">Dense CSS grid usage. Hover to see the trace edge glow and subtle scale.</p>
          </div>
          
          <div 
            className="grid gap-3" 
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
            role="list"
          >
            <SkillCard label="React.js / Next.js" category="Frontend" />
            <SkillCard label="TypeScript" category="Frontend" />
            <SkillCard label="Framer Motion" category="Frontend" />
            
            <SkillCard label="Node.js / Express" category="Backend" />
            <SkillCard label="Spring Boot" category="Backend" />
            <SkillCard label="PostgreSQL" category="Backend" />
            
            <SkillCard label="Docker" category="DevOps" />
            <SkillCard label="CI/CD Pipelines" category="DevOps" />
            <SkillCard label="AWS" category="DevOps" />
          </div>
        </section>

      </div>
    </div>
  );
}
