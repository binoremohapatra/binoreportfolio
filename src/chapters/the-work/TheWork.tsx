"use client";

/**
 * chapters/the-work/TheWork.tsx
 *
 * CHAPTER IV — "THE WORK"
 * Restructured into industry clusters using 3D Cards.
 */

import { useRef } from "react";
import { TextPressure } from "@/components/ui/TextPressure";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

const CLUSTERS = [
  {
    clusterName: "Infrastructure",
    clusterIntro: "Systems that keep things moving.",
    projects: [
      {
        title: "SwiftRoute",
        domain: "Logistics",
        description: "Real-time logistics tracking engine with continuous GPS synchronization and secure role-based portals.",
        tech: ["Node.js", "Socket.IO", "Redis"],
      },
      {
        title: "ReactorX",
        domain: "Commerce",
        description: "Automated e-commerce infrastructure with integrated catalog management and verified digital checkout.",
        tech: ["Next.js", "Tailwind", "Stripe"],
      },
      {
        title: "SubMeter",
        domain: "SaaS Billing",
        description: "Subscription billing architecture supporting automated recurring invoices and usage-based pricing models.",
        tech: ["Next.js", "Stripe", "Prisma"],
      }
    ]
  },
  {
    clusterName: "Intelligence",
    clusterIntro: "Systems that respond and collaborate.",
    projects: [
      {
        title: "Maeve AI",
        domain: "AI",
        description: "Multimodal assistant streaming real-time local language models through a vision-aware 3D avatar.",
        tech: ["React", "Python", "LLM API"],
      }
    ]
  },
  {
    clusterName: "Public Systems",
    clusterIntro: "Systems that serve people directly.",
    projects: [
      {
        title: "City Voice",
        domain: "Civic Tech",
        description: "Cross-platform mobile utility for geolocating and tracking live civic infrastructure issues.",
        tech: ["React Native", "Firebase", "Maps API"],
      },
      {
        title: "CivicSolver",
        domain: "Governance",
        description: "Unified citizen complaint network delivering synchronized operations across web and mobile platforms.",
        tech: ["Vue", "Node.js", "PostgreSQL"],
      }
    ]
  }
];

export function TheWork() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0d0f12] py-32 px-6 lg:px-24">
      <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#e0303d] select-none mb-4 text-center font-bold">
        SHIPPED PRODUCTS
      </div>

      <div className="mb-24 w-full max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          From civic technology to automated SaaS platforms.
        </h2>
      </div>

      <div className="flex flex-col gap-32 max-w-7xl mx-auto">
        {CLUSTERS.map((cluster) => (
          <div key={cluster.clusterName} className="flex flex-col gap-12">
            
            {/* Cluster Header */}
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-2xl font-mono text-white mb-2">{cluster.clusterName}</h3>
              <p className="text-white/50 text-sm tracking-wide">{cluster.clusterIntro}</p>
            </div>

            {/* Cluster Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {cluster.projects.map((project) => (
                <CardContainer key={project.title} className="inter-var w-full">
                  <CardBody className="bg-[#181a1b] relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:border-white/[0.2] border-white/[0.1] w-full h-auto rounded-xl p-6 border flex flex-col justify-between min-h-[320px]">
                    
                    <div>
                      <CardItem
                        translateZ="50"
                        className="text-xl font-bold text-white mb-4"
                      >
                        {project.title}
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ="60"
                        className="text-white/60 text-sm leading-relaxed"
                      >
                        {project.description}
                      </CardItem>
                    </div>

                    <div className="mt-8 space-y-4">
                      {/* Domain Tag (Always visible) */}
                      <CardItem translateZ={40} className="w-full">
                        <span className="inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#e0303d] bg-[#e0303d]/10 rounded-sm">
                          {project.domain}
                        </span>
                      </CardItem>

                      {/* Tech Stack (Visible on hover via group-hover/card) */}
                      <CardItem translateZ={20} className="w-full h-8 overflow-hidden relative">
                        <div className="absolute inset-0 flex flex-wrap gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          {project.tech.map((tech) => (
                            <span key={tech} className="text-[10px] text-white/40 font-mono border border-white/10 px-2 py-0.5 rounded-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardItem>
                    </div>

                  </CardBody>
                </CardContainer>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
