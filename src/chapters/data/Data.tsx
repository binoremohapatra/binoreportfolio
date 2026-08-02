"use client";

/**
 * chapters/data/Data.tsx
 *
 * CHAPTER V — "DATA"
 * Competence & Code: Server/Database stack.
 */

import { useRef } from "react";
import { VariableProximity } from "@/components/ui/VariableProximity";
import { GitHubGlobe } from "@/components/ui/Globe";

const BACKEND_STACK = [
  "Node.js", "Go", "Python", "PostgreSQL", "Redis", "Docker",
  "Kubernetes", "GraphQL", "REST", "gRPC", "WebSockets",
  "Kafka", "AWS", "GCP", "Vercel"
];

export function Data() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background py-32 px-6 flex flex-col justify-center items-center overflow-hidden">
      <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/20 select-none mb-12">
        <span>05</span>
        <span className="mx-3 text-white/10">—</span>
        <span>Data & Systems</span>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <h2 className="font-serif text-4xl md:text-6xl text-primary mb-8 leading-tight">
          Architecting robust backends and data pipelines.
        </h2>

        <p className="text-muted-foreground/60 max-w-2xl mx-auto text-lg mb-12">
          From high-throughput event processing to semantic search and RAG pipelines.
          Scalable, idempotent, and observable by default.
        </p>

        <div className="w-full h-[400px] mb-24 opacity-80 mix-blend-screen pointer-events-none">
          <GitHubGlobe />
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {BACKEND_STACK.map((tech, i) => (
            <div key={tech} className="relative">
              <VariableProximity
                label={tech}
                containerRef={containerRef}
                radius={150}
                falloff="gaussian"
                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                toFontVariationSettings="'wght' 900, 'opsz' 40"
                className="font-sans text-2xl md:text-4xl text-primary/80 cursor-default tracking-tight transition-colors hover:text-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
