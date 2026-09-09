# Production QA Checklist

## Content and routes

- [ ] Home, About, Work, Contact and every project detail route render.
- [ ] Exactly 13 project covers and 119 gallery images resolve.
- [ ] No runner character appears anywhere.
- [ ] Contact details and all four social links are correct.

## Responsive and interaction

- [ ] 360, 768, 1024 and 1440 layouts have no horizontal overflow.
- [ ] Motion is restrained and reduced-motion mode removes physical movement.
- [ ] Interactive targets work with keyboard and touch.
- [ ] Focus rings are always visible.

## Backend and database

- [ ] Invalid input returns 422 without creating a row.
- [ ] Honeypot returns 202 without creating a row.
- [ ] The sixth request in one hour returns 429.
- [ ] A valid request creates exactly one row.
- [ ] `anon` and `authenticated` cannot read, insert, update or delete inquiries.
- [ ] A failed email notification does not remove or roll back the stored inquiry.

## Build and release

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] No secrets are committed.
- [ ] Metadata, sitemap, robots and project social previews use the production URL.
