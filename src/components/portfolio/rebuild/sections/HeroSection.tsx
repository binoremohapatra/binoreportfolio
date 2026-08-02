'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import HeroScene from '../HeroScene';

interface SectionProps {
    id: string;
}

export default function HeroSection({ id }: SectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        const elements = containerRef.current.querySelectorAll('.hero-element');

        // Staggered reveal tied to scroll progress (if we were scrolling into it), 
        // but Hero is at top, so just animate in on load
        gsap.fromTo(elements,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
        );
    }, { scope: containerRef });

    const scrollToSection = (targetId: string) => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id={id} ref={containerRef} className="portfolio-section relative w-full h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24">
            {/* Three.js Layer behind hero text */}
            <HeroScene />

            <div className="relative z-10 max-w-4xl">
                <h1 className="hero-element text-4xl sm:text-6xl md:text-7xl font-mono font-bold tracking-tight mb-4">
                    <span className="text-foreground">BINORE</span>{' '}
                    <span className="text-primary">MOHAPATRA</span>
                </h1>

                <p className="hero-element text-xl sm:text-2xl text-muted font-sans mb-8 max-w-2xl">
                    Full-Stack Developer bridging high-performance systems with immaculate engineering precision.
                </p>

                <div className="hero-element flex flex-wrap gap-4">
                    <button
                        onClick={() => scrollToSection('projects')}
                        className="px-6 py-3 bg-primary text-background font-mono text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
                    >
                        View Projects
                    </button>
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="px-6 py-3 border border-border text-foreground font-mono text-sm rounded hover:bg-border/50 transition-colors"
                    >
                        Get in Touch
                    </button>
                </div>
            </div>
        </section>
    );
}
