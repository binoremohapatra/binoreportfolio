'use client';

import React from 'react';
import { cn } from '@/lib/utils'; // Optional if available, otherwise just use standard template literals

interface Section {
    id: string;
    label: string;
}

interface NavRailProps {
    sections: Section[];
    activeSection: string;
}

export default function NavRail({ sections, activeSection }: NavRailProps) {

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
            {sections.map((section) => {
                const isActive = section.id === activeSection;
                return (
                    <button
                        key={section.id}
                        onClick={() => scrollTo(section.id)}
                        className="group relative flex items-center justify-end w-8 h-8"
                        aria-label={`Scroll to ${section.label}`}
                    >
                        {/* Label - hidden by default, shown on hover */}
                        <span className={cn(
                            "absolute right-10 px-2 py-1 rounded bg-graphite/80 backdrop-blur border border-border text-xs font-mono whitespace-nowrap transition-all duration-300 pointer-events-none",
                            isActive ? "text-primary opacity-100 translate-x-0" : "text-muted opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                        )}>
                            {section.label}
                        </span>

                        {/* Dot */}
                        <div className={cn(
                            "rounded-full transition-all duration-300",
                            isActive
                                ? "w-3 h-3 bg-primary shadow-[0_0_10px_rgba(78,225,255,0.6)]"
                                : "w-2 h-2 bg-muted/50 group-hover:bg-primary/50 group-hover:w-3 group-hover:h-3"
                        )} />
                    </button>
                );
            })}
        </div>
    );
}
