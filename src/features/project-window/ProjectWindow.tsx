"use client";

/**
 * features/project-window/ProjectWindow.tsx
 *
 * PROJECT WINDOW — The canonical project card component.
 * Assembles: Notch (top-right cut) + SplitFrame (62/38 split) + Cut Light.
 *
 * Used by: Aperture (Ch.III) horizontal shelf, TheWork (Ch.IV) case-study list.
 *
 * The card is a self-contained visual unit — all motion is applied externally
 * by the chapter's timeline, not internally. This keeps the window "dumb"
 * and composable.
 */

import { forwardRef } from 'react';
import { Notch } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/projects';

interface ProjectWindowProps {
  project: Project;
  className?: string;
  /** If true, shows the full three-act breakdown (TheWork mode). Default: card mode. */
  expanded?: boolean;
  /** Active index for the chapter nav highlight */
  isActive?: boolean;
}

export const ProjectWindow = forwardRef<HTMLDivElement, ProjectWindowProps>(
  ({ project, className, expanded = false, isActive = false }, ref) => {
    return (
      <Notch
        ref={ref}
        size={16}
        className={cn(
          'relative flex flex-col bg-graphite border border-border/40 cut-light overflow-hidden transition-all duration-700',
          isActive && 'border-white/20 cut-light-strong',
          className
        )}
      >
        {/* Accent line — top edge, full width, project accent color */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: project.accent, opacity: isActive ? 0.9 : 0.35 }}
        />

        {/* Window header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
            {project.index}
            <span className="mx-2 text-border">—</span>
            {project.category}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/60">{project.year}</span>
        </div>

        {/* Project name */}
        <div className="px-6 pt-5 pb-0">
          <h3 className="font-serif text-3xl text-primary leading-none tracking-tight">
            {project.name}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            {project.tagline}
          </p>
        </div>

        {/* SplitFrame — 62% content / 4px seam / 38% meta */}
        <div
          className="relative flex mt-6 mx-6 mb-0"
          style={{ gap: 'var(--gap-seam, 4px)' }}
        >
          {/* Primary panel (62%) — description */}
          <div
            className="flex-none"
            style={{ width: 'var(--split-ratio, 62%)' }}
          >
            <p className="text-[13px] leading-relaxed text-foreground/60 line-clamp-3">
              {project.description}
            </p>
          </div>

          {/* Seam — vertical FaultLine */}
          <div className="flex-none w-px bg-border/20 self-stretch" />

          {/* Secondary panel (38%) — stack tags */}
          <div className="flex-1 flex flex-wrap content-start gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80 border border-border/30 rounded-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Three-act breakdown — only in expanded TheWork mode */}
        {expanded && (
          <div className="mx-6 mt-6 grid grid-cols-3 gap-4">
            {([
              { label: 'Problem', content: project.problem },
              { label: 'Solution', content: project.solution },
              { label: 'Impact', content: project.impact },
            ] as const).map(({ label, content }) => (
              <div key={label} className="border-t border-border/20 pt-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/50 mb-2">
                  {label}
                </p>
                <p className="text-[12px] leading-relaxed text-foreground/50">{content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Window footer */}
        <div className="flex items-center justify-between px-6 py-5 mt-auto">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: project.accent }}
          />
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors"
              aria-label={`View ${project.name} live`}
            >
              View ↗
            </a>
          )}
        </div>
      </Notch>
    );
  }
);

ProjectWindow.displayName = 'ProjectWindow';
