-- Per-user alert email preference

create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  alert_email text,
  updated_at timestamptz not null default now()
);

alter table user_settings enable row level security;

create policy "Users manage own settings" on user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
