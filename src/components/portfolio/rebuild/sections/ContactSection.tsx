'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Code, Briefcase, Mail, Phone } from 'lucide-react';

interface SectionProps {
  id: string;
}

export default function ContactSection({ id }: SectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.contact-element');

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
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section id={id} ref={containerRef} className="portfolio-section relative w-full min-h-[80vh] flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 pb-32">
      <div className="relative z-10 max-w-4xl w-full">
        <h2 className="contact-element text-3xl sm:text-5xl font-mono font-bold mb-8 text-foreground">
          Let's build something<span className="text-primary">.</span>
        </h2>

        <p className="contact-element text-lg text-muted font-sans mb-12 max-w-xl">
          Currently open to software engineering internships and full-time opportunities. My inbox is always open.
        </p>

        <div className="contact-element flex flex-wrap gap-4 mb-16">
          <a href="mailto:binore@example.com" className="flex items-center gap-2 px-6 py-3 bg-graphite border border-border hover:border-primary hover:text-primary text-foreground font-mono text-sm rounded transition-colors">
            <Mail size={16} /> Email
          </a>
          <a href="tel:+919999999999" className="flex items-center gap-2 px-6 py-3 bg-graphite border border-border hover:border-primary hover:text-primary text-foreground font-mono text-sm rounded transition-colors">
            <Phone size={16} /> Phone
          </a>
          <a href="https://linkedin.com/in/binore" className="flex items-center gap-2 px-6 py-3 bg-graphite border border-border hover:border-primary hover:text-primary text-foreground font-mono text-sm rounded transition-colors">
            <Briefcase size={16} /> LinkedIn
          </a>
          <a href="https://github.com/binore" className="flex items-center gap-2 px-6 py-3 bg-graphite border border-border hover:border-primary hover:text-primary text-foreground font-mono text-sm rounded transition-colors">
            <Code size={16} /> GitHub
          </a>
        </div>

        <div className="contact-element flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-status shadow-[0_0_8px_rgba(61,220,132,0.8)]"></span>
          </div>
          <span className="font-mono text-xs text-status tracking-widest">
            SYSTEM ONLINE — OPEN TO OPPORTUNITIES
          </span>
        </div>
      </div>
    </section>
  );
}
