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
- **Type**: React + Vite, 3-page SPA with Express backend API
- **Preview path**: `/`
- **Description**: Full cinematic portfolio website for actor/filmmaker Chris Potter

### Pages (3 independent pages each with hero):
1. **Home** (`/`) — hero, marquee, work, "in his words", about, filmography, gallery, timeline, newsletter
2. **Contact** (`/contact`) — hero (editing suite photo), management inquiry form (13 fields + terms)
3. **Fanbase** (`/fanbase`) — hero, supporters hub, fan badges, community wall, exclusive access, updates, join CTA

### Features:
- **Social sidebar**: Fixed bottom-left horizontal icons — Telegram, WhatsApp, Facebook, IMDb
- **Filmography**: Interactive sortable/filterable table of 24+ real credits with type/medium filters
- **"In His Words"**: Rotating quote carousel with category filters (craft, heartland, direction, life, philosophy)
- **Career Timeline**: Horizontal drag-to-scroll timeline with 15 milestones and 7 awards
- **Newsletter**: Backend-powered subscribe endpoint (nodemailer + SMTP env vars + JSON subscriber storage)
- **Fan Badges**: 5 tiers ($1K–$25K) each with inquiry modal sending to fandom@chrispotterofficial.site
- **Contact Form**: Full management form (name, email, phone, address, company, reason, project details, timeline, how heard, preferred contact, terms)
- **NavBar + Footer**: Shared across all pages; nav links to all 3 pages

### Shared Components:
- `src/components/shared/NavBar.tsx`
- `src/components/shared/SocialSidebar.tsx`
- `src/components/shared/PageHero.tsx`
- `src/components/shared/Footer.tsx`

### Data files:
- `src/data/filmography.ts` — 24 credits
- `src/data/timeline.ts` — 15 timeline events + 7 awards
- `src/data/quotes.ts` — 8 quotes

### Photos: 24 real Chris Potter photos at `artifacts/chris-potter/public/photos/`

### Backend (api-server on port 8080):
- `POST /api/newsletter/subscribe` — saves to data/subscribers.json, sends welcome email
- `POST /api/newsletter/unsubscribe`
- `POST /api/contact/management` — sends to management@chrispotterofficial.site
- `POST /api/contact/fanbase` — sends to fandom@chrispotterofficial.site
- nodemailer configured via env vars: SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_FROM_EMAIL, MANAGEMENT_EMAIL, FANDOM_EMAIL

### Vite proxy: `/api/*` → `http://localhost:8080`

### API Server (`artifacts/api-server`)
- Standard Express 5 API server on port 8080
- Handles newsletter + contact form submissions
- nodemailer installed for email sending
