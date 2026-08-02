import React from 'react';
import { type LucideIcon } from 'lucide-react';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
    title: string;
    description: string;
    stack: string[];
    glyph: LucideIcon;
    link: string;
    status?: 'live' | 'archived';
}

export function ProjectCard({
    title,
    description,
    stack,
    glyph: GlyphComponent,
    link,
    status,
}: ProjectCardProps) {

    // Calculate a generic SVG trace path based on absolute positioning
    // A simple L-shape from top-left inward and down to top-right
    const tracePathD = "M 0 20 L 20 20 L 40 40 L 280 40 L 300 20 L 350 20";

    return (
        <a href={link} className={styles.card} aria-label={`View ${title} project`}>
            {/* SVG Trace Line */}
            <div className={styles.traceContainer} aria-hidden="true">
                <svg width="100%" height="100%" preserveAspectRatio="none">
                    <path
                        className={styles.tracePath}
                        d="M -10,32 L 32,32 L 32,-10"
                        // This path starts off-card (left), comes in, turns up to meet the glyph
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Animated dot traveling along the path could be done with animateMotion in pure SVG */}
                    <circle r="2" className={styles.traceDot}>
                        <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path="M -10,32 L 32,32 L 32,-10"
                            keyPoints="0;1"
                            keyTimes="0;1"
                            calcMode="linear"
                        />
                    </circle>
                </svg>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>

                    <div className={styles.glyphPlate} aria-hidden="true">
                        <GlyphComponent size={16} strokeWidth={1.5} />
                    </div>
                </div>

                <p className={styles.description}>{description}</p>

                <div className={styles.footer}>
                    <ul className={styles.stackList} aria-label="Technologies used">
                        {stack.map((tech, idx) => (
                            <li key={idx} className={styles.stackPill}>
                                {tech}
                            </li>
                        ))}
                    </ul>

                    {status === 'live' && (
                        <div className={styles.statusContainer} title="Status: Live">
                            <div className={styles.statusDot} />
                            <span className={styles.statusLabel}>LIVE</span>
                        </div>
                    )}
                </div>
            </div>
        </a>
    );
}
