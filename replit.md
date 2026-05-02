# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Chris Potter Portfolio (`artifacts/chris-potter`)
- **Type**: React + Vite, frontend-only, no backend
- **Preview path**: `/`
- **Description**: A high-end cinematic portfolio website for actor/filmmaker Chris Potter
- **Features**:
  - Full-bleed hero with auto-rotating real photos (extracted from user-supplied ZIP)
  - Actor/Director/Producer role pills
  - Scrolling marquee (ACTOR · DIRECTOR · PRODUCER · HEARTLAND)
  - Selected Work section with Heartland as featured project
  - About section with stats (30+ years, 17 Heartland seasons, 50+ credits)
  - Photo gallery grid (24 real photos at `public/photos/`)
  - Pull quote
  - Contact/Casting inquiry form
  - Scroll-triggered reveal animations
  - Fully responsive (mobile, tablet, desktop)
- **Design**: Dark cinematic editorial — deep navy/black background, Bebas Neue display font, white text, modelled after Mark Woodland Behance reference
- **Photos**: 24 real Chris Potter photos extracted from attached ZIP → `artifacts/chris-potter/public/photos/`

### API Server (`artifacts/api-server`)
- Standard Express 5 API server, currently serving health check only
