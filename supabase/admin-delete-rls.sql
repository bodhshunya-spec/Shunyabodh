-- ============================================================
-- ADMIN — Delete any community content (articles, media, podcast)
-- Run in: Supabase Dashboard → SQL Editor (New query)
--
-- Use the same UUID as ADMIN_USER_ID in .env.local
-- ============================================================

drop policy if exists "Admin can delete any article" on public.articles;
drop policy if exists "Admin can delete any media" on public.media;
drop policy if exists "Admin can delete any podcast episode" on public.podcast_episodes;

create policy "Admin can delete any article"
  on public.articles for delete
  to authenticated
  using (auth.uid() = '2bbb7f12-9a39-440e-8805-53d5393a601d'::uuid);

create policy "Admin can delete any media"
  on public.media for delete
  to authenticated
  using (auth.uid() = '2bbb7f12-9a39-440e-8805-53d5393a601d'::uuid);

create policy "Admin can delete any podcast episode"
  on public.podcast_episodes for delete
  to authenticated
  using (auth.uid() = '2bbb7f12-9a39-440e-8805-53d5393a601d'::uuid);

-- Storage: allow admin to remove uploaded files from other users
drop policy if exists "Admin can delete any media file" on storage.objects;

create policy "Admin can delete any media file"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and auth.uid() = '2bbb7f12-9a39-440e-8805-53d5393a601d'::uuid
  );
