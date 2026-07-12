-- ============================================================
-- CONTACT MESSAGES
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now(),
  constraint contact_name_length check (char_length(name) >= 2),
  constraint contact_message_length check (char_length(message) >= 5)
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors) can submit a message
create policy "Anyone can submit contact messages"
  on public.contact_messages for insert
  with check (true);

-- Only the site owner (admin UUID) can read messages.
-- Replace YOUR_ADMIN_UUID with your Supabase auth user id before running.
create policy "Only admin can view contact messages"
  on public.contact_messages for select
  using (auth.uid() = 'YOUR_ADMIN_UUID'::uuid);
