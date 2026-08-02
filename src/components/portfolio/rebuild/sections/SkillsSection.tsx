'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface SectionProps {
    id: string;
}

const SKILLS = [
    'React/Next.js',
    'Node/Express',
    'Spring Boot',
    'PostgreSQL/MySQL',
    'Docker/CI-CD',
    'JWT/RBAC',
    'Socket.IO/WebSockets',
    'Flutter/Dart',
    'AI/LLM Integration',
];

export default function SkillsSection({ id }: SectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        const elements = containerRef.current.querySelectorAll('.skill-element');

        gsap.fromTo(elements,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
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
                <h2 className="skill-element text-3xl sm:text-5xl font-mono font-bold mb-12 text-foreground">
                    The stack that ships<span className="text-accent">.</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {SKILLS.map((skill, idx) => (
                        <div
                            key={idx}
                            className="skill-element border border-border/50 bg-graphite/40 backdrop-blur-sm p-4 sm:p-6 rounded flex items-center hover:border-primary/50 hover:bg-graphite/60 transition-colors"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mr-3" />
                            <span className="font-mono text-sm sm:text-base text-foreground">{skill}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
