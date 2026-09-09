# Antigravity Build Contract — Ezz Eldin Portfolio

## Mission

Finish and production-harden this portfolio without changing the approved art direction, content model, routes or security boundary. The repository already contains the working Next.js foundation, all optimized assets, structured project data, the contact API and a Supabase migration.

## Non-negotiable visual rules

1. Preserve the warm off-white canvas, graphite ink, metallic 2.5D assets and sparse electric-blue signal accent.
2. Preserve the four primary routes: `/`, `/about`, `/work`, `/contact`, plus `/work/[slug]` details.
3. Do not add the runner character. It is explicitly cancelled.
4. Do not fake 360-degree 3D. Supplied art is raster; use restrained 2.5D depth, masks, pointer tilt and scroll choreography.
5. Do not replace supplied assets, rewrite project names or invent client work.
6. Use GSAP ScrollTrigger for page choreography and Motion only for local component state. Every motion must respect `prefers-reduced-motion`.
7. Keep the shared curved transition, dark project CTA and footer on all primary pages.

## Technical contract

- Next.js 16 App Router, React 19, TypeScript strict mode and Tailwind CSS 4.
- Server Components by default. Add `use client` only for forms, navigation state and motion.
- Static portfolio data stays in `content/*.json`. Do not move projects into a CMS or database.
- Supabase is used only for `contact_submissions` in v1.
- `/api/contact` is the only public application endpoint. Keep validation, honeypot, request-size check, hashed-IP rate limit and server-only secret key.
- Never expose `SUPABASE_SECRET_KEY`, `CONTACT_HASH_SECRET` or `RESEND_API_KEY` to browser code.
- Do not add authentication, an admin panel, analytics trackers or cookies unless Ezz approves them.

## Execution order

1. Run `npm ci`, copy `.env.example` to `.env.local`, then configure secrets.
2. Create a Supabase project and run `supabase db push`.
3. Verify that `anon` and `authenticated` cannot read or insert into `contact_submissions`.
4. Run `npm run typecheck`, `npm run lint`, `npm test` and `npm run build`.
5. Finish responsive polish at 360, 768, 1024 and 1440 widths.
6. Verify keyboard navigation, focus visibility, reduced motion, image alt text, 404 behavior and form states.
7. Deploy only after the checklist in `docs/QA_CHECKLIST.md` passes.

## Definition of done

- All routes render with no console errors or hydration warnings.
- All 13 projects and 119 gallery images resolve from `public/assets`.
- Contact submission creates one database record; optional email failure does not lose the record.
- Spam honeypot, validation, rate limiting and secret handling work.
- Lighthouse targets: Performance 85+, Accessibility 95+, Best Practices 95+, SEO 95+ on representative mobile pages.
- No approved copy, links, phone number or visual assets are missing.
