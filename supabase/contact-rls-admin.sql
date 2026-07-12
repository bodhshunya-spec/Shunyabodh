-- ============================================================
-- CONTACT MESSAGES — Admin-only SELECT policy
-- Run in: Supabase Dashboard → SQL Editor (New query)
-- NOT in Table Editor or external clients with limited roles.
--
-- STEP 1: Find your admin UUID
--   Supabase → Authentication → Users → copy your user's UUID
--
-- STEP 2: Use the same UUID as ADMIN_USER_ID in .env.local, then run this script.
-- ============================================================

-- Fix ownership if you see: "must be owner of relation contact_messages"
alter table public.contact_messages owner to postgres;

-- Remove old permissive SELECT policy
drop policy if exists "Authenticated users can view contact messages"
  on public.contact_messages;

drop policy if exists "Only admin can view contact messages"
  on public.contact_messages;

-- Admin-only SELECT
create policy "Only admin can view contact messages"
  on public.contact_messages for select
  to authenticated
  using (auth.uid() = '2bbb7f12-9a39-440e-8805-53d5393a601d'::uuid);

-- INSERT policy unchanged: anyone can still submit via /contact
-- (policy "Anyone can submit contact messages" should already exist)
