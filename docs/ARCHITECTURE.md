# Architecture

## Frontend

- App Router routes are defined under `app/`.
- Server Components own page composition and data reads.
- `Reveal`, `AssetStage` and `ContactForm` are the only initial Client Components.
- `content/projects.json` drives the work index, static params, detail metadata and galleries.
- `public/assets` contains 150 production WebP files. Images are rendered through `next/image`.

## Backend

- The backend is a Next.js Route Handler at `app/api/contact/route.ts`.
- There is no separate server because the product has one small server-side workflow.
- The route validates with Zod, rejects oversized payloads, uses a honeypot, hashes the source IP, enforces five submissions per hour, stores the inquiry, then optionally sends an email notification.
- Database storage is the source of truth. Email is a notification and may fail without losing the submission.

## Data ownership

| Data | Source of truth | Why |
| --- | --- | --- |
| Projects and galleries | `content/projects.json` + `public/assets` | Versioned, fast and deployable without runtime queries |
| Contact and social links | `content/contact.json` | One edit updates every page |
| Design tokens | `content/design-tokens.json` + CSS variables | Stable visual contract |
| Inquiries | Supabase Postgres | Dynamic, private and queryable |

## Deliberately excluded from v1

- Authentication and admin UI
- CMS and project CRUD
- Client-side Supabase access
- Separate Express/Nest backend
- Object storage for existing static assets
- True WebGL/3D models
