-- RoutineTracker — full schema (Phases 1–10)
-- Run in Supabase SQL Editor after creating your project.

-- ─── Trades ───────────────────────────────────────────────────────────────

create table if not exists trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trade_date date not null default current_date,
  instrument text not null,
  direction text not null check (direction in ('long', 'short')),
  entry_price numeric,
  sl_price numeric,
  tp_price numeric,
  lot_size numeric,
  outcome text check (outcome in ('win', 'loss', 'be')),
  r_multiple numeric,
  strategy text,
  emotion_note text,
  notes text,
  daily_analysis text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trade_screenshots (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references trades(id) on delete cascade,
  image_url text not null,
  screenshot_type text not null check (screenshot_type in ('entry', 'exit', 'sl', 'tp')),
  created_at timestamptz not null default now()
);

-- ─── Routine & Wellness ───────────────────────────────────────────────────

create table if not exists daily_routine (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  wake_time time,
  sleep_time time,
  worked boolean default false,
  work_start time,
  work_end time,
  exercised boolean default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists water_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  glasses int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists prayer_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  fajr boolean default false,
  dhuhr boolean default false,
  asr boolean default false,
  maghrib boolean default false,
  isha boolean default false,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists meal_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  breakfast boolean default false,
  lunch boolean default false,
  dinner boolean default false,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists hygiene_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  shower boolean default false,
  skincare boolean default false,
  teeth boolean default false,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

-- ─── Quran & Personal ─────────────────────────────────────────────────────

create table if not exists quran_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  pages_read int default 0,
  surah text,
  completed boolean default false,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists personal_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  content text,
  mood text,
  goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

-- ─── Alerts ───────────────────────────────────────────────────────────────

create table if not exists alert_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_type text not null,
  threshold numeric,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, rule_type)
);

create table if not exists alert_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_type text not null,
  message text not null,
  email_sent boolean default false,
  triggered_at timestamptz not null default now()
);

-- ─── RLS (multi-user: each user sees only their own data) ─────────────────

alter table trades enable row level security;
alter table trade_screenshots enable row level security;
alter table daily_routine enable row level security;
alter table water_log enable row level security;
alter table prayer_log enable row level security;
alter table meal_log enable row level security;
alter table hygiene_log enable row level security;
alter table quran_log enable row level security;
alter table personal_log enable row level security;
alter table alert_rules enable row level security;
alter table alert_log enable row level security;

-- Trades policies
create policy "Users manage own trades" on trades
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own screenshots" on trade_screenshots
  for all using (
    exists (select 1 from trades t where t.id = trade_id and t.user_id = auth.uid())
  );

-- Routine policies
create policy "Users manage own routine" on daily_routine
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own water" on water_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own prayers" on prayer_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own meals" on meal_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own hygiene" on hygiene_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own quran" on quran_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own personal" on personal_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own alert rules" on alert_rules
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users view own alert log" on alert_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Storage bucket for trade screenshots ─────────────────────────────────

insert into storage.buckets (id, name, public)
values ('trade-screenshots', 'trade-screenshots', false)
on conflict (id) do nothing;

create policy "Users upload own screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users read own screenshots"
  on storage.objects for select
  using (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users delete own screenshots"
  on storage.objects for delete
  using (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── Default alert rules (run after first user signs up) ──────────────────
-- insert into alert_rules (user_id, rule_type, threshold, enabled) values
--   ('YOUR_USER_ID', 'exercise_gap_days', 2, true),
--   ('YOUR_USER_ID', 'work_hours_min', 9, true),
--   ('YOUR_USER_ID', 'sleep_hours_min', 6, true),
--   ('YOUR_USER_ID', 'journal_cutoff_hour', 22, true);
