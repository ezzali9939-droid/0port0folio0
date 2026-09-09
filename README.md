# Ezz Eldin Portfolio

Production-ready handoff for a four-page graphic and visual design portfolio, including 13 project collections, 150 optimized web assets, a private contact backend and a secure Supabase migration.

## Start

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The pages work without Supabase; submitting the contact form requires the environment variables documented in `.env.example`.

## Project map

- `app/` — Next.js routes, UI and contact endpoint
- `content/` — approved copy, design tokens, contact data and project manifest
- `public/assets/` — optimized production WebP assets
- `supabase/migrations/` — private inquiry table and security grants
- `docs/` — architecture, database, API, implementation and QA documentation
- `ANTIGRAVITY_BUILD_BRIEF.md` — mandatory execution contract for Antigravity

## Quality commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Locked decisions

- The runner character is cancelled.
- Project content stays static and version-controlled.
- Supabase stores contact inquiries only.
- No authentication, admin panel or CMS in v1.
- Motion is 2.5D, restrained and reduced-motion safe.
