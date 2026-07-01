-- Daily journal analysis (one note per user per day)

create table if not exists journal_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journal_date date not null,
  daily_analysis text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, journal_date)
);

alter table journal_daily enable row level security;

create policy "Users manage own journal daily" on journal_daily
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
