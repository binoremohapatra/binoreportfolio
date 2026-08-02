/**
 * lib/projects.ts
 * Single source of truth for all portfolio project data.
 * Referenced by: Aperture (Ch.III), TheWork (Ch.IV), and any future resume export.
 */

export interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  stack: string[];
  year: string;
  category: string;
  link?: string;
  github?: string;
  /** Hex accent color for card treatment */
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'swiftroute',
    index: '01',
    name: 'SwiftRoute',
    tagline: 'Real-Time Fleet Intelligence',
    description:
      'A high-throughput vehicle routing and dispatch platform processing 50,000+ live location events per second with sub-50ms end-to-end latency.',
    problem:
      'Logistics companies were losing ₹2.4M/month to inefficient last-mile routing and dispatcher blind spots across their fleet of 800+ vehicles.',
    solution:
      'Built a distributed Node.js event pipeline using Socket.IO + Redis Pub/Sub, with a React dashboard rendering 800 vehicle positions at 60fps via WebGL canvas.',
    impact:
      'Reduced average delivery time by 23%, cut dispatcher overhead by 40%, and eliminated route duplication saving 18% fuel cost across the fleet.',
    stack: ['Node.js', 'Socket.IO', 'Redis', 'PostgreSQL', 'React', 'WebGL'],
    year: '2024',
    category: 'Systems Engineering',
    accent: '#1a6ef5',
  },
  {
    id: 'maeve-ai',
    index: '02',
    name: 'Maeve AI',
    tagline: 'Embodied AI Companion',
    description:
      'A real-time AI companion with a WebGL-rendered 3D avatar, Ollama LLM integration, and WebSocket streaming for sub-200ms conversational response.',
    problem:
      'AI assistants felt disembodied and clinical. Users needed a presence, not just a text interface — something that felt like engaging with an intelligent being.',
    solution:
      'Architected a full-stack system combining React Three Fiber for avatar rendering, a Python FastAPI backend for LLM orchestration, and a custom WebSocket protocol for real-time expression sync.',
    impact:
      'Achieved sub-200ms response latency, 94% emotion-state accuracy on live video input, and a 4.8/5 engagement rating from early testers.',
    stack: ['Three.js', 'React Three Fiber', 'Python', 'FastAPI', 'Ollama', 'WebSocket'],
    year: '2024',
    category: 'AI Engineering',
    accent: '#8b5cf6',
  },
  {
    id: 'submeter',
    index: '03',
    name: 'SubMeter',
    tagline: 'Usage-Based Billing Engine',
    description:
      'A metered billing infrastructure for multi-tenant SaaS applications with real-time usage aggregation, Stripe integration, and automated invoicing.',
    problem:
      'Startups building usage-based products were spending engineering cycles on billing infrastructure instead of their core product.',
    solution:
      'Built a composable billing engine with tRPC for type-safe API contracts, Prisma event-sourcing for usage aggregation, and a Stripe webhook pipeline handling all edge cases in idempotent transactions.',
    impact:
      'Reduced billing integration time from 3 sprints to 2 days for teams using the platform. Zero billing discrepancies across 10,000+ processed invoices.',
    stack: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL', 'tRPC', 'Zod'],
    year: '2024',
    category: 'Full-Stack',
    accent: '#10b981',
  },
  {
    id: 'signal-stack',
    index: '04',
    name: 'SignalStack',
    tagline: 'Developer Observability Platform',
    description:
      'A lightweight, self-hosted observability dashboard for monitoring API performance, error rates, and resource utilisation — no vendor lock-in.',
    problem:
      'Teams with tight budgets were either flying blind or paying $1,200/month for Datadog subscriptions that overwhelmed them with noise.',
    solution:
      'Built a time-series data pipeline in Go, a PostgreSQL-backed metrics store with efficient BRIN indexing, and a Next.js dashboard with real-time SSE updates.',
    impact:
      'P99 latency detection within 500ms of incident. Teams reduced mean-time-to-detect by 71% vs manual log scanning.',
    stack: ['Go', 'Next.js', 'PostgreSQL', 'Server-Sent Events', 'Docker'],
    year: '2023',
    category: 'DevOps',
    accent: '#f59e0b',
  },
  {
    id: 'formweave',
    index: '05',
    name: 'FormWeave',
    tagline: 'Intelligent Form Infrastructure',
    description:
      'A schema-driven form builder and submission pipeline with conditional logic, multi-step flows, file uploads, and webhook routing.',
    problem:
      'Internal ops teams at mid-size companies were using Google Forms for workflows that required conditional routing, file handling, and CRM sync — none of which it could do.',
    solution:
      'Built a JSON Schema → React form renderer with a drag-and-drop builder, Cloudflare R2 for file storage, and a conditional webhook router that integrates with 40+ services.',
    impact:
      'Replaced 12 bespoke internal tools across 3 departments. Saved an estimated 800 hours/year in manual data transfer.',
    stack: ['Next.js', 'React Hook Form', 'Zod', 'Cloudflare R2', 'Prisma'],
    year: '2023',
    category: 'Full-Stack',
    accent: '#ec4899',
  },
  {
    id: 'codebase-ai',
    index: '06',
    name: 'Codebase AI',
    tagline: 'Context-Aware Code Intelligence',
    description:
      'A VSCode extension and web interface that provides codebase-aware AI assistance — understanding file relationships, import graphs, and architectural context.',
    problem:
      'General-purpose LLMs had no understanding of a project\'s unique architecture, leading to suggestions that were syntactically correct but structurally wrong.',
    solution:
      'Built a RAG pipeline using an AST-aware chunker, pgvector for semantic code search, and a streaming chat interface. Context window management keeps the most relevant code within budget.',
    impact:
      'Generated suggestions accepted without modification 68% of the time, vs 31% for vanilla GPT-4o in A/B testing on the same codebases.',
    stack: ['TypeScript', 'LangChain', 'pgvector', 'FastAPI', 'VSCode API'],
    year: '2024',
    category: 'AI Engineering',
    accent: '#06b6d4',
  },
];
