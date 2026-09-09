# Database and Security

## Model

`public.contact_submissions` stores private inquiries. It uses a sequential bigint identity key, timezone-aware timestamps, bounded text fields, status checks and two query-aligned indexes.

## Access boundary

- RLS is enabled.
- `anon` and `authenticated` have no table privileges and no policies.
- Only the server route uses `SUPABASE_SECRET_KEY` to query and insert.
- The secret key stays server-only and intentionally bypasses RLS.
- IP addresses are never stored directly. A one-way SHA-256 hash salted with `CONTACT_HASH_SECRET` is used only for rate limiting.

## Supabase setup

1. Install the Supabase CLI and sign in.
2. Link the repository: `supabase link --project-ref YOUR_PROJECT_REF`.
3. Apply the migration: `supabase db push`.
4. Copy the project URL and a new `sb_secret_...` key into `.env.local`.
5. Confirm the `public` schema is exposed to the Data API. The migration explicitly grants only `service_role`; this addresses the 2026 change where new tables are no longer automatically exposed to API roles.
6. Run Database Advisors and resolve every security or performance warning.

## Verification queries

```sql
select relrowsecurity from pg_class where oid = 'public.contact_submissions'::regclass;
select grantee, privilege_type from information_schema.role_table_grants where table_schema = 'public' and table_name = 'contact_submissions';
select indexname, indexdef from pg_indexes where schemaname = 'public' and tablename = 'contact_submissions';
```

Expected result: RLS is enabled, only `service_role` has SELECT/INSERT, and both composite indexes exist.
