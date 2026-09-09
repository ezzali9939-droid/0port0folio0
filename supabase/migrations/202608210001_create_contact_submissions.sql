begin;

create table if not exists public.contact_submissions (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 160 and email = lower(email)),
  project_type text not null check (project_type in (
    'Brand Identity',
    'Social Media & Campaigns',
    'Website & UI/UX',
    'Print & Packaging',
    'Full Creative System',
    'Other'
  )),
  budget_range text check (budget_range is null or budget_range in (
    'Under 5,000 EGP',
    '5,000–10,000 EGP',
    '10,000–25,000 EGP',
    '25,000+ EGP',
    'Not sure yet'
  )),
  message text not null check (char_length(message) between 20 and 2000),
  status text not null default 'new' check (status in ('new', 'replied', 'archived', 'spam')),
  ip_hash text check (ip_hash is null or char_length(ip_hash) = 64),
  user_agent text check (user_agent is null or char_length(user_agent) <= 512),
  referrer text check (referrer is null or char_length(referrer) <= 1000),
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_status_created_idx
  on public.contact_submissions (status, created_at desc);

create index if not exists contact_submissions_ip_created_idx
  on public.contact_submissions (ip_hash, created_at desc)
  where ip_hash is not null;

alter table public.contact_submissions enable row level security;

revoke all on table public.contact_submissions from anon, authenticated;
grant select, insert on table public.contact_submissions to service_role;
grant usage, select on sequence public.contact_submissions_id_seq to service_role;

comment on table public.contact_submissions is
  'Private portfolio inquiry inbox. Access is server-only through the Supabase secret key.';

commit;
