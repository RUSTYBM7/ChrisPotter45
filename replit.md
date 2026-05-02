# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (dev) + Vercel Serverless (production)
- **Build**: esbuild (server), Vite (client)

## Key Commands

- `pnpm --filter @workspace/chris-potter run dev` — run frontend locally
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/chris-potter run build` — production build

## Artifacts

### Chris Potter Portfolio (`artifacts/chris-potter`)
- **Type**: React + Vite SPA, Express backend (dev), Vercel Serverless (prod)
- **Preview path**: `/`
- **Stack**: React, Vite, Tailwind, Framer Motion, Wouter, Bebas Neue + Inter fonts

## Pages

1. **Home** (`/`) — cinematic hero, marquee, work, quotes, about, filmography, gallery, timeline, newsletter
2. **Contact** (`/contact`) — management inquiry form (13 fields, SMTP auto-reply + SMS)
3. **Fanbase** (`/fanbase`) — fan badges (5 tiers), community, badge application form
4. **Press Kit** (`/press-kit`) — editorial press assets
5. **Fan Portal** (`/fan-portal`) — magic link login, member dashboard (certificate, exclusive content, podcasts, VIP sessions)
6. **Admin** (`/admin`) — full admin dashboard (password protected via ADMIN_PASSWORD)

## Fan Portal (authenticated area)
- **Auth**: Stateless magic link via HMAC-SHA256 signed tokens (no DB needed)
- **Session**: localStorage, 24h expiry
- **Sections**: member certificate, exclusive announcements, BTS gallery, podcast episodes (3 YouTube embeds), VIP session requests, collaboration banner
- **VIP Session Types**: Private Meet, Podcast Co-Host, Creative Collaboration, Exclusive Interview

## Admin Dashboard (`/admin`)
- **Auth**: Password protected (ADMIN_PASSWORD env var) → HMAC-signed 12h session token
- **Tabs**:
  - **Overview** — stats cards, recent activity (subs/contacts/VIP)
  - **Subscribers** — searchable table, edit tags/notes/phone, delete, export CSV
  - **Badge Applications** — fan badge forms by status (pending/read/responded/archived)
  - **Management Inquiries** — professional contacts with status tracking + notes
  - **Compose Email** — recipient picker (all/badge/management/vip/custom), 5 templates, HTML body editor, live preview, batch send
  - **VIP Sessions** — session requests with approve/schedule/decline + date picker + notes
  - **Reports** — animated bar charts, response rate, weekly growth
  - **Settings** — env var checklist, data storage docs

## API Endpoints (dev: Express on port 8080, prod: Vercel Serverless in api/ folder)

### Newsletter
- `POST /api/newsletter/subscribe` — save to subscribers.json, welcome email, optional SMS

### Contact
- `POST /api/contact/management` — save to contacts.json, notify management, auto-reply to sender, admin SMS
- `POST /api/contact/fanbase` — save to contacts.json, notify fandom, auto-reply to sender, admin SMS

### Auth (Fan Portal magic links)
- `POST /api/auth/request` — sign token, send magic link via email
- `POST /api/auth/verify` — verify token, return 24h session token

### Admin (all except login + POST /vip require Bearer token)
- `POST /api/admin/login` — verify ADMIN_PASSWORD, return 12h token
- `GET /api/admin/stats` — overview stats
- `GET/PATCH/DELETE /api/admin/subscribers` — subscriber management
- `GET/PATCH /api/admin/contacts` — contact form submissions
- `GET/POST/PATCH /api/admin/vip` — VIP session requests
- `POST /api/admin/compose` — batch send email via SMTP
- `GET /api/admin/export` — CSV export (subscribers or contacts)

## Data Storage
- JSON files in `artifacts/api-server/data/` (dev) or `/tmp/cp-data/` (Vercel, ephemeral)
- Files: `subscribers.json`, `contacts.json`, `vip.json`
- For persistent Vercel storage: connect Vercel KV, Supabase, or PlanetScale

## Shared Components
- `src/components/shared/NavBar.tsx`
- `src/components/shared/HeroSocialBar.tsx` — horizontal Telegram/WhatsApp/Facebook/IMDb row at bottom-left of all heroes
- `src/components/shared/Footer.tsx` — 4-column footer with all links
- `src/components/shared/PageHero.tsx`

## Data Files
- `src/data/filmography.ts` — 24+ credits
- `src/data/timeline.ts` — 15 milestones + 7 awards
- `src/data/quotes.ts` — 8 quotes

## Photos
24 real Chris Potter photos at `artifacts/chris-potter/public/photos/` (IMG_0982 – IMG_1003)

## Environment Variables Required
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM_EMAIL`
- `MANAGEMENT_EMAIL` (default: management@chrispotterofficial.site)
- `FANDOM_EMAIL` (default: fandom@chrispotterofficial.site)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `ADMIN_SMS_NUMBER`
- `ADMIN_PASSWORD` — enables /admin dashboard
- `ADMIN_SECRET` — signs admin session tokens (defaults to hardcoded fallback)
- `MAGIC_LINK_SECRET` — signs fan portal magic links (defaults to hardcoded fallback)

## Vercel Deployment
- `artifacts/chris-potter/vercel.json` — build + rewrite config
- `artifacts/chris-potter/api/` — serverless functions (contact, newsletter, auth, admin)
- No Replit-specific dependencies in vite.config.ts
- Deploy from the `artifacts/chris-potter/` directory or root with filter
