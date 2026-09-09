# Deployment Inputs Still Required

The build is complete without secrets. Before production deployment, the owner must provide:

1. Final public domain, used as `NEXT_PUBLIC_SITE_URL`.
2. A Supabase project URL and new server-only `sb_secret_...` key.
3. A random `CONTACT_HASH_SECRET` of at least 32 characters.
4. Optional: Resend API key plus a verified sender domain for email notifications.

Do not send these values in project documents or commit them to Git. Add them directly to the deployment environment.

No additional design assets, project covers, portraits, contact links or portfolio copy are required to begin implementation.
