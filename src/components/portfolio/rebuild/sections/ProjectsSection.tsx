'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ExternalLink, Code } from 'lucide-react';

interface SectionProps {
    id: string;
}

const PROJECTS = [
    { name: 'SwiftRoute', stack: 'React, Node.js, Maps API', github: '#' },
    { name: 'ReactorX', stack: 'Next.js, Tailwind, Stripe', github: '#' },
    { name: 'Maeve AI', stack: 'React, Python, LLM API', github: '#' },
    { name: 'SubMeter', stack: 'Spring Boot, PostgreSQL', github: '#' },
    { name: 'ResearchConnect', stack: 'Next.js, Prisma, WebSockets', github: '#' },
];

export default function ProjectsSection({ id }: SectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        const elements = containerRef.current.querySelectorAll('.project-element');

        gsap.fromTo(elements,
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section id={id} ref={containerRef} className="portfolio-section relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24">
            <div className="relative z-10 max-w-5xl w-full">
                <h2 className="project-element text-3xl sm:text-5xl font-mono font-bold mb-12 text-foreground">
                    Shipped, not just started<span className="text-primary">_</span>
                </h2>

                <div className="flex flex-col gap-4">
                    {PROJECTS.map((project, idx) => (
                        <div
                            key={idx}
                            className="project-element group border-b border-border/50 py-6 flex flex-col sm:flex-row sm:items-center justify-between hover:border-primary transition-colors cursor-pointer"
                        >
                            <div>
                                <h3 className="text-xl sm:text-2xl font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-sm font-mono text-muted mt-2">
                                    {project.stack}
                                </p>
                            </div>

                            <div className="mt-4 sm:mt-0 flex gap-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={project.github} className="p-2 bg-graphite rounded-full border border-border hover:border-primary hover:text-primary text-muted transition-colors">
                                    <Code size={20} />
                                </a>
                                <a href="#" className="p-2 bg-graphite rounded-full border border-border hover:border-primary hover:text-primary text-muted transition-colors">
                                    <ExternalLink size={20} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
